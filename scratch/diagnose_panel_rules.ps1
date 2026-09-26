$ErrorActionPreference = 'Stop'

$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$indexPath = (Resolve-Path 'index.html').Path
$fileUrl = 'file:///' + $indexPath.Replace('\', '/')
$userDataDir = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), 'edge_test_user_data_' + [System.Guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $userDataDir -Force | Out-Null
$proc = Start-Process -FilePath $edge -ArgumentList '--headless=new', '--remote-debugging-port=9222', "--user-data-dir=$userDataDir", '--disable-gpu', $fileUrl -PassThru
Start-Sleep -Seconds 3

try {
    $targets = Invoke-RestMethod -Uri 'http://127.0.0.1:9222/json'
    $mainTarget = $targets | Where-Object { $_.url -like '*index.html*' } | Select-Object -First 1
    $ws = [System.Net.WebSockets.ClientWebSocket]::new()
    $ws.ConnectAsync([System.Uri]::new($mainTarget.webSocketDebuggerUrl), [System.Threading.CancellationToken]::None).Wait()

    function Send([string]$expr) {
        $msg = @{ id = 1; method = 'Runtime.evaluate'; params = @{ expression = $expr; returnByValue = $true } } | ConvertTo-Json
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($msg)
        $ws.SendAsync([System.ArraySegment[byte]]::new($bytes), [System.Net.WebSockets.WebSocketMessageType]::Text, $true, [System.Threading.CancellationToken]::None).Wait()

        $timeout = [DateTime]::Now.AddSeconds(5)
        while ([DateTime]::Now -lt $timeout) {
            $buf = New-Object byte[] 65536
            $res = $ws.ReceiveAsync([System.ArraySegment[byte]]::new($buf), [System.Threading.CancellationToken]::None).Result
            $txt = [System.Text.Encoding]::UTF8.GetString($buf, 0, $res.Count)
            $obj = $txt | ConvertFrom-Json
            if ($obj.PSObject.Properties['id'] -and $obj.id -eq 1) {
                return $obj.result.result.value
            }
        }
        throw "Timeout"
    }

    $diag = Send @"
        (function() {
            var panel = document.getElementById('discord-floating-panel');
            var container = document.getElementById('discord-floating-container');
            container.classList.add('open');
            var matchedRules = [];
            for (var i = 0; i < document.styleSheets.length; i++) {
                try {
                    var sheet = document.styleSheets[i];
                    var rules = sheet.cssRules || sheet.rules;
                    for (var j = 0; j < rules.length; j++) {
                        var r = rules[j];
                        if (r.selectorText && panel.matches(r.selectorText)) {
                            matchedRules.push(r.selectorText + ' -> { visibility: ' + r.style.visibility + '; opacity: ' + r.style.opacity + '; display: ' + r.style.display + ' }');
                        }
                    }
                } catch(e) {}
            }
            return JSON.stringify({
                containerClasses: container.className,
                matchedRules: matchedRules,
                computedVisibility: window.getComputedStyle(panel).visibility,
                computedOpacity: window.getComputedStyle(panel).opacity
            });
        })()
"@
    Write-Host "Diagnostic: $diag"
} finally {
    if ($proc -and -not $proc.HasExited) { $proc | Stop-Process -Force }
    Remove-Item -Path $userDataDir -Recurse -Force -ErrorAction SilentlyContinue
}
