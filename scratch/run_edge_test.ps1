$ErrorActionPreference = 'Stop'

$edgePath = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$testHtmlUri = 'file:///' + (Resolve-Path 'scratch\test_page.html').Path.Replace('\', '/')

Write-Host "Running Edge on $testHtmlUri..."
$output = & $edgePath --headless --virtual-time-budget=4000 --dump-dom $testHtmlUri 2>&1

$outputStr = $output -join "`n"
$preMatch = [regex]::Match($outputStr, '<pre>(.*?)</pre>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
if ($preMatch.Success) {
    Write-Host "=== TEST RESULTS ==="
    Write-Host $preMatch.Groups[1].Value
} else {
    Write-Host "=== FULL DUMP ==="
    Write-Host $outputStr.Substring(0, [Math]::Min(1000, $outputStr.Length))
}
