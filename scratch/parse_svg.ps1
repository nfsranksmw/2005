$raw1 = Get-Content -Raw -Encoding UTF8 scratch/test.svg
$ms1 = [regex]::Matches($raw1, '<text[^>]*>(.*?)</text>')
Write-Host "=== TOURNAMENT 1 (6as1doj5) ==="
Write-Host "Total text elements: $($ms1.Count)"
foreach ($m in $ms1) {
    Write-Host $m.Groups[1].Value
}

Write-Host "`n`n====================================`n`n"

$raw2 = Get-Content -Raw -Encoding UTF8 scratch/ev1n0yug.svg
$ms2 = [regex]::Matches($raw2, '<text[^>]*>(.*?)</text>')
Write-Host "=== TOURNAMENT 2 (ev1n0yug) ==="
Write-Host "Total text elements: $($ms2.Count)"
foreach ($m in $ms2) {
    Write-Host $m.Groups[1].Value
}
