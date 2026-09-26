$routesContent = Get-Content 'assets/js/routes-data.js' -Raw -Encoding utf8
$urlMatches = [regex]::Matches($routesContent, 'https://docs\.google\.com/spreadsheets/d/e/[^"]+')

Write-Host "Total Google Sheets URLs found: $($urlMatches.Count)"

# Let's inspect the first 15 URLs
$count = 0
foreach ($m in $urlMatches) {
    $count++
    if ($count -gt 15) { break }
    $url = $m.Value
    
    # Fetch CSV
    try {
        $csvText = curl.exe -L -s $url
        $lines = $csvText -split "`r?`n" | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
        Write-Host "`n=== [$count] URL: $url ==="
        for ($i = 0; $i -lt [Math]::Min(5, $lines.Count); $i++) {
            Write-Host ("   Line " + $i + ": " + $lines[$i])
        }
    } catch {
        Write-Warning "Failed on $url"
    }
}
