$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
    $edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

$url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYMNQXaAzlB0eoNiiWX5RekaYWGZWXGgYbWsPSj57AhOjmkh9zGXetaIROVrYoys1Djg4j7aCkFyup/pubhtml?gid=634347005&single=true"

# Run msedge headless and dump dom
Write-Host "Running Edge headless dump..."
$dom = & $edgePath --headless --disable-gpu --dump-dom $url
Write-Host "Dump length: $($dom.Length)"

$aMatches = [regex]::Matches($dom, 'href="([^"]+)"')
Write-Host "Total links in DOM: $($aMatches.Count)"
foreach ($a in $aMatches) {
    if ($a.Groups[1].Value -match 'youtu|bilibili|twitch') {
        Write-Host "Found video link: $($a.Groups[1].Value)"
    }
}

# Check if table or rows exist in DOM
$trMatches = [regex]::Matches($dom, '(?s)<tr[^>]*>([\s\S]*?)</tr>')
Write-Host "Total TR in DOM: $($trMatches.Count)"
for ($i = 0; $i -lt [Math]::Min(10, $trMatches.Count); $i++) {
    $clean = [regex]::Replace($trMatches[$i].Value, '<[^>]+>', ' ').Trim()
    $clean = [regex]::Replace($clean, '\s+', ' ')
    Write-Host ("TR " + $i + ": " + $clean)
}
