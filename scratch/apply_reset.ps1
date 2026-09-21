$path = "assets/js/blacklist-data.js"
$content = Get-Content -Raw -Encoding UTF8 $path

# 1. Reset drivers rep, victories, bestTimes
$content = [regex]::Replace($content, 'rep:\s*\d+,', 'rep: 0,')
$content = [regex]::Replace($content, 'victories:\s*\{\s*p1:\s*\d+,\s*p2:\s*\d+,\s*p3:\s*\d+,\s*p4:\s*\d+\s*\},', 'victories: { p1: 0, p2: 0, p3: 0, p4: 0 },')
$content = [regex]::Replace($content, 'bestTimes:\s*\{\s*first:\s*\d+,\s*second:\s*\d+,\s*third:\s*\d+\s*\},', 'bestTimes: { first: 0, second: 0, third: 0 },')

# 2. Reset top3 challenges
$regexTop3 = '\{\s*rank:\s*\d+,\s*pilot:\s*"[^"]*",\s*car:\s*"[^"]*",\s*time:\s*"[^"]*",\s*(bonus:\s*\d+,\s*badge:\s*"[^"]*",\s*repMoney:\s*\d+,\s*repBadge:\s*"[^"]*"\s*\})'
$content = [regex]::Replace($content, $regexTop3, '{ rank: null, pilot: "Por disputar", car: "", time: "--:--.---", $1')

# Save UTF8 without BOM
[System.IO.File]::WriteAllText((Resolve-Path $path), $content, [System.Text.Encoding]::UTF8)
Write-Host "Successfully reset assets/js/blacklist-data.js"
