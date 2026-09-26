$edgePath = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$testHtmlUri = 'file:///' + (Resolve-Path 'desafio\index.html').Path.Replace('\', '/')
$userDataDir = 'C:\Users\willi\.gemini\antigravity\scratch\nfs-mw-records\scratch\.edge_test_user_data'
$dumpFile = 'C:\Users\willi\.gemini\antigravity\scratch\nfs-mw-records\scratch\desafio_dump.txt'

if (Test-Path $dumpFile) { Remove-Item $dumpFile -Force }

$proc = Start-Process -FilePath $edgePath -ArgumentList "--headless=new", "--user-data-dir=$userDataDir", "--disable-gpu", "--virtual-time-budget=6000", "--dump-dom", "$testHtmlUri" -NoNewWindow -PassThru -RedirectStandardOutput $dumpFile
$proc.WaitForExit(10000)

if (Test-Path $dumpFile) {
    $cards = Get-Content $dumpFile | Select-String -Pattern 'season-ch-card'
    Write-Host "season-ch-card matches found in desafio/index.html: $($cards.Count)"
    $activeSection = Get-Content $dumpFile | Select-String -Pattern '<section id="view-[^"]+" class="view-section active"'
    Write-Host "Active section in rendered DOM: $($activeSection.Line)"
}
