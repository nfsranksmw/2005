$content = Get-Content -Raw -Encoding UTF8 "assets/js/blacklist-data.js"

$repMatches = [regex]::Matches($content, 'rep:\s*\d+,')
Write-Host "rep matches: $($repMatches.Count) (Expected: 15 in drivers)"

$vicMatches = [regex]::Matches($content, 'victories:\s*\{\s*p1:\s*\d+,\s*p2:\s*\d+,\s*p3:\s*\d+,\s*p4:\s*\d+\s*\},')
Write-Host "victories matches: $($vicMatches.Count) (Expected: 15 in drivers)"

$btMatches = [regex]::Matches($content, 'bestTimes:\s*\{\s*first:\s*\d+,\s*second:\s*\d+,\s*third:\s*\d+\s*\},')
Write-Host "bestTimes matches: $($btMatches.Count) (Expected: 15 in drivers)"
