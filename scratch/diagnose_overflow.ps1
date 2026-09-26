$ErrorActionPreference = 'Stop'

$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
if (-not (Test-Path $edge)) { $edge = 'C:\Program Files\Microsoft\Edge\Application\msedge.exe' }

$indexPath = (Resolve-Path 'index.html').Path
$fileUrl = 'file:///' + $indexPath.Replace('\', '/')
$userDataDir = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), 'edge_diag_' + [System.Guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $userDataDir -Force | Out-Null

$proc = Start-Process -FilePath $edge -ArgumentList '--headless=new', '--remote-debugging-port=9224', "--user-data-dir=$userDataDir", '--disable-gpu', $fileUrl -PassThru
Start-Sleep -Seconds 3

try {
    $targets = Invoke-RestMethod -Uri 'http://127.0.0.1:9224/json'
    $mainTarget = $targets | Where-Object { $_.url -like '*index.html*' } | Select-Object -First 1
    $ws = [System.Net.WebSockets.ClientWebSocket]::new()
    $ws.ConnectAsync([System.Uri]::new($mainTarget.webSocketDebuggerUrl), [System.Threading.CancellationToken]::None).Wait()

    $msgId = 1
    function SendCmd([string]$method, [hashtable]$params = @{}) {
        $script:msgId++
        $msg = @{ id = $script:msgId; method = $method; params = $params } | ConvertTo-Json -Depth 5
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($msg)
        $ws.SendAsync([System.ArraySegment[byte]]::new($bytes), [System.Net.WebSockets.WebSocketMessageType]::Text, $true, [System.Threading.CancellationToken]::None).Wait()

        $timeout = [DateTime]::Now.AddSeconds(5)
        while ([DateTime]::Now -lt $timeout) {
            $buf = New-Object byte[] 65536
            $res = $ws.ReceiveAsync([System.ArraySegment[byte]]::new($buf), [System.Threading.CancellationToken]::None).Result
            $txt = [System.Text.Encoding]::UTF8.GetString($buf, 0, $res.Count)
            $obj = $txt | ConvertFrom-Json
            if ($obj.PSObject.Properties['id'] -and $obj.id -eq $script:msgId) {
                return $obj.result
            }
        }
        throw "Timeout waiting for response"
    }

    $null = SendCmd 'Emulation.setDeviceMetricsOverride' @{ width = 1366; height = 768; deviceScaleFactor = 1; mobile = $false }
    Start-Sleep -Milliseconds 400

    $res = SendCmd 'Runtime.evaluate' @{
        expression = @"
            (function() {
                var docWidth = document.documentElement.clientWidth;
                var all = document.querySelectorAll('*');
                var overflowing = [];
                for (var i = 0; i < all.length; i++) {
                    var el = all[i];
                    var rect = el.getBoundingClientRect();
                    if (rect.right > docWidth + 1) {
                        overflowing.push({
                            tag: el.tagName,
                            id: el.id,
                            className: el.className,
                            right: rect.right,
                            docWidth: docWidth,
                            diff: rect.right - docWidth
                        });
                    }
                }
                return JSON.stringify(overflowing.slice(0, 10));
            })()
"@
        returnByValue = $true
    }
    Write-Host "Overflowing elements at 1366px:"
    Write-Host $res.result.value

    $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "Done", [System.Threading.CancellationToken]::None).Wait()
}
finally {
    if ($proc -and -not $proc.HasExited) { $proc.Kill() }
    if (Test-Path $userDataDir) { Remove-Item -Recurse -Force $userDataDir -ErrorAction SilentlyContinue }
}
