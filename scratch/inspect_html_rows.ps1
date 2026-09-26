$html = [System.IO.File]::ReadAllText('scratch/nfs_world_loop.html', [System.Text.Encoding]::UTF8)

Write-Host "File length: $($html.Length)"
Write-Host "Contains <table: $($html.Contains('<table'))"
Write-Host "Contains <tr: $($html.Contains('<tr'))"

$trRegex = [regex]'<tr[\s\S]*?</tr>'
$trMatches = $trRegex.Matches($html)
Write-Host "Total <tr> matches: $($trMatches.Count)"

$i = 0
foreach ($tr in $trMatches) {
    $rowHtml = $tr.Value
    # check if row has cells
    $tdRegex = [regex]'<td[^>]*>([\s\S]*?)</td>'
    $tdMatches = $tdRegex.Matches($rowHtml)
    if ($tdMatches.Count -gt 0) {
        $texts = @()
        $links = @()
        foreach ($td in $tdMatches) {
            $val = $td.Groups[1].Value
            $clean = [regex]::Replace($val, '<[^>]+>', ' ').Trim()
            $clean = [regex]::Replace($clean, '\s+', ' ')
            $texts += $clean

            # find links
            $aRegex = [regex]'href="([^"]+)"'
            $aMatches = $aRegex.Matches($val)
            foreach ($a in $aMatches) {
                $links += $a.Groups[1].Value
            }
        }
        $lineSummary = $texts -join " | "
        if (-not [string]::IsNullOrWhiteSpace($lineSummary)) {
            Write-Host ("Row $i : " + $lineSummary)
            if ($links.Count -gt 0) {
                Write-Host ("   LINKS: " + ($links -join " , "))
            }
        }
    }
    $i++
}
