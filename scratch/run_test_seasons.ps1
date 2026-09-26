$edgePath = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$testHtmlUri = 'file:///' + (Resolve-Path 'scratch\test_seasons.html').Path.Replace('\', '/')
$userDataDir = 'C:\Users\willi\.gemini\antigravity\scratch\nfs-mw-records\scratch\.edge_test_user_data'
$dumpFile = 'C:\Users\willi\.gemini\antigravity\scratch\nfs-mw-records\scratch\dump.txt'
$errFile = 'C:\Users\willi\.gemini\antigravity\scratch\nfs-mw-records\scratch\err.txt'

if (Test-Path $dumpFile) { Remove-Item $dumpFile -Force }
if (Test-Path $errFile) { Remove-Item $errFile -Force }

$proc = Start-Process -FilePath $edgePath -ArgumentList "--headless=new", "--user-data-dir=$userDataDir", "--disable-gpu", "--virtual-time-budget=6000", "--dump-dom", "$testHtmlUri" -NoNewWindow -PassThru -RedirectStandardOutput $dumpFile -RedirectStandardError $errFile
$proc.WaitForExit(10000)

if (Test-Path $dumpFile) {
    $content = Get-Content $dumpFile -Raw
    Write-Host "Dump file length: $($content.Length)"
    $preMatch = [regex]::Match($content, '<pre id="test-results">(.*?)</pre>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
    if ($preMatch.Success) {
        Write-Host "=== TEST SUITE RESULTS ==="
        Write-Host $preMatch.Groups[1].Value
    } else {
        Write-Host "=== PRE NOT FOUND. FIRST 500 CHARS ==="
        Write-Host $content.Substring(0, [Math]::Min(500, $content.Length))
    }
} else {
    Write-Host "No dump file generated."
}

if (Test-Path $errFile) {
    $errContent = Get-Content $errFile -Raw
    if ($errContent.Length -gt 0) {
        Write-Host "STDERR: $errContent"
    }
}
