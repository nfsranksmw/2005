$ErrorActionPreference = 'Stop'

$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$indexPath = (Resolve-Path 'index.html').Path
$fileUrl = 'file:///' + $indexPath.Replace('\', '/')

$proc = Start-Process -FilePath $edge -ArgumentList '--headless=new', '--remote-debugging-port=9222', '--disable-gpu', $fileUrl -PassThru
Start-Sleep -Seconds 3

try {
    $targets = Invoke-RestMethod -Uri 'http://127.0.0.1:9222/json'
    Write-Host "Found $($targets.Count) targets in Edge:"
    foreach ($t in $targets) {
        Write-Host "  - Title: $($t.title) | URL: $($t.url)"
    }
} catch {
    Write-Warning "Could not connect to CDP: $_"
} finally {
    if ($proc -and -not $proc.HasExited) {
        $proc | Stop-Process -Force
    }
}
