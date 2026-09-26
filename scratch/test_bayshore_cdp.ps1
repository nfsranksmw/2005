$ErrorActionPreference = 'Stop'

$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$indexPath = (Resolve-Path 'index.html').Path
$fileUrl = 'file:///' + $indexPath.Replace('\', '/')

$userDataDir = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), 'edge_test_user_data_' + [System.Guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $userDataDir -Force | Out-Null

$proc = Start-Process -FilePath $edge -ArgumentList '--headless=new', '--remote-debugging-port=9222', '--allow-file-access-from-files', '--disable-web-security', ('--user-data-dir=' + $userDataDir), '--disable-gpu', $fileUrl -PassThru
Start-Sleep -Seconds 3

try {
    $targets = Invoke-RestMethod -Uri 'http://127.0.0.1:9222/json'
    $mainTarget = $targets | Where-Object { $_.url -like '*index.html*' } | Select-Object -First 1

    $ws = [System.Net.WebSockets.ClientWebSocket]::new()
    $uri = [System.Uri]::new($mainTarget.webSocketDebuggerUrl)
    $cts = [System.Threading.CancellationTokenSource]::new(10000)
    $ws.ConnectAsync($uri, $cts.Token).Wait()

    function Send-Cmd([string]$method, [hashtable]$params = @{}, [int]$id = 1) {
        $json = @{ id = $id; method = $method; params = $params } | ConvertTo-Json -Depth 5
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
        $ws.SendAsync([System.ArraySegment[byte]]::new($bytes), [System.Net.WebSockets.WebSocketMessageType]::Text, $true, [System.Threading.CancellationToken]::None).Wait()

        $timeout = [DateTime]::Now.AddSeconds(12)
        while ([DateTime]::Now -lt $timeout) {
            $ms = [System.IO.MemoryStream]::new()
            $buf = New-Object byte[] 8192
            do {
                $res = $ws.ReceiveAsync([System.ArraySegment[byte]]::new($buf), [System.Threading.CancellationToken]::None).Result
                $ms.Write($buf, 0, $res.Count)
            } while (-not $res.EndOfMessage)
            $obj = [System.Text.Encoding]::UTF8.GetString($ms.ToArray()) | ConvertFrom-Json
            if ($obj.PSObject.Properties['id'] -and $obj.id -eq $id) { return $obj }
        }
        throw "Timeout waiting for id $id"
    }

    Send-Cmd 'Runtime.enable' @{} 1 | Out-Null
    Start-Sleep -Seconds 2

    # Test 1: Check routesData has Seaside & Power Station with alias
    $r1 = Send-Cmd 'Runtime.evaluate' @{ expression = '(() => { const r = routesData.find(x => x.name.includes("Power Station")); return { name: r.name, alias: r.alias, type: r.type }; })()' ; returnByValue = $true } 2
    Write-Host 'Route Data:' ($r1.result.result.value | ConvertTo-Json -Compress)

    # Test 2: Trigger loadLeaderboardForRoute and check rows
    $r2 = Send-Cmd 'Runtime.evaluate' @{ expression = 'new Promise(async (resolve) => { const r = routesData.find(x => x.name.includes("Power Station")); await loadLeaderboardForRoute(r); setTimeout(() => { const rows = Array.from(document.querySelectorAll("#tbody-sprintdrag-junkman tr")).map(tr => tr.innerText.replace(/\s+/g, " ")); const links = Array.from(document.querySelectorAll("#tbody-sprintdrag-junkman a")).map(a => a.href); resolve({ rowCount: rows.length, rows: rows, links: links }); }, 1500); })' ; awaitPromise = $true; returnByValue = $true } 3
    Write-Host 'Leaderboard Rows count:' $r2.result.result.value.rowCount
    Write-Host 'Links count:' $r2.result.result.value.links.Count
    Write-Host 'First 5 rows:'
    $r2.result.result.value.rows | Select-Object -First 5 | ForEach-Object { Write-Host '  ' $_ }

    # Test 3: Search filter for 'Bayshore & Power'
    $r3 = Send-Cmd 'Runtime.evaluate' @{ expression = '(() => { document.getElementById("route-search").value = "Bayshore & Power"; filterRoutes(); const visible = Array.from(document.querySelectorAll("#routes-grid-container .route-card")).map(c => c.querySelector("h3").innerText); return visible; })()' ; returnByValue = $true } 4
    Write-Host 'Filtered visible routes for "Bayshore & Power":' ($r3.result.result.value -join ', ')

    $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, '', [System.Threading.CancellationToken]::None).Wait()
} finally {
    if ($proc -and -not $proc.HasExited) { $proc.Kill() }
    Remove-Item -Path $userDataDir -Recurse -Force -ErrorAction SilentlyContinue
}
