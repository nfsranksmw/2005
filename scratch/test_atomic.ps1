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

    $res = Send "(() => { toggleDiscordFloatingDrawer(null, true); return JSON.stringify({ hasOpen: document.getElementById('discord-floating-container').classList.contains('open'), vis: window.getComputedStyle(document.getElementById('discord-floating-panel')).visibility, op: window.getComputedStyle(document.getElementById('discord-floating-panel')).opacity }); })()"
    Write-Host "Result: $res"
} finally {
    if ($proc -and -not $proc.HasExited) { $proc | Stop-Process -Force }
    Remove-Item -Path $userDataDir -Recurse -Force -ErrorAction SilentlyContinue
}
