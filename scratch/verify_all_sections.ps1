$edgePath = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$userDataDir = 'C:\Users\willi\.gemini\antigravity\scratch\nfs-mw-records\scratch\.edge_test_user_data'

$testSections = @(
    @{ Folder = "leaderboard"; ExpectedView = "view-leaderboard" },
    @{ Folder = "challenges";  ExpectedView = "view-challenges" },
    @{ Folder = "desafio";     ExpectedView = "view-challenges" },
    @{ Folder = "routes";      ExpectedView = "view-routes" },
    @{ Folder = "submit";      ExpectedView = "view-submit" },
    @{ Folder = "members";     ExpectedView = "view-members" }
)

foreach ($item in $testSections) {
    $folder = $item.Folder
    $expected = $item.ExpectedView
    $targetHtml = (Resolve-Path "$folder\index.html").Path.Replace('\', '/')
    $dumpFile = "scratch\dump_$folder.txt"
    if (Test-Path $dumpFile) { Remove-Item $dumpFile -Force }

    $proc = Start-Process -FilePath $edgePath -ArgumentList "--headless=new", "--user-data-dir=$userDataDir", "--disable-gpu", "--virtual-time-budget=4000", "--dump-dom", "file:///$targetHtml" -NoNewWindow -PassThru -RedirectStandardOutput $dumpFile
    $proc.WaitForExit(8000)

    if (Test-Path $dumpFile) {
        $activeSection = Get-Content $dumpFile | Select-String -Pattern "<section id=""$expected"" class=""view-section active"""
        if ($activeSection) {
            Write-Host "PASS: $folder/index.html renders $expected as active"
        } else {
            Write-Host "FAIL: $folder/index.html did NOT have active $expected"
        }
    } else {
        Write-Host "FAIL: No dump output for $folder"
    }
}
