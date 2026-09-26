$edgePath = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$testHtmlUri = 'file:///' + (Resolve-Path 'scratch\test_admin.html').Path.Replace('\', '/')
$userDataDir = 'C:\Users\willi\.gemini\antigravity\scratch\nfs-mw-records\scratch\.edge_test_user_data'
$dumpFile = 'C:\Users\willi\.gemini\antigravity\scratch\nfs-mw-records\scratch\admin_dump.txt'

if (Test-Path $dumpFile) { Remove-Item $dumpFile -Force }

$proc = Start-Process -FilePath $edgePath -ArgumentList "--headless=new", "--user-data-dir=$userDataDir", "--disable-gpu", "--virtual-time-budget=5000", "--dump-dom", "$testHtmlUri" -NoNewWindow -PassThru -RedirectStandardOutput $dumpFile
$proc.WaitForExit(8000)

if (Test-Path $dumpFile) {
    Get-Content $dumpFile | Select-String -Pattern "PASS:|FAIL:|ALL_"
}
