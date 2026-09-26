$html = [System.IO.File]::ReadAllText('scratch/nfs_world_loop_output_html.html', [System.Text.Encoding]::UTF8)

# Check for strings like 'X1PROCL' or '4:53' or 'HighPriest'
$pos = $html.IndexOf('X1PROCL', [System.StringComparison]::OrdinalIgnoreCase)
Write-Host "Index of X1PROCL: $pos"

$pos2 = $html.IndexOf('HighPriest', [System.StringComparison]::OrdinalIgnoreCase)
Write-Host "Index of HighPriest: $pos2"

$pos3 = $html.IndexOf('youtube', [System.StringComparison]::OrdinalIgnoreCase)
Write-Host "Index of youtube: $pos3"
if ($pos3 -ge 0) {
    Write-Host ("Found youtube at " + $pos3 + ":")
    Write-Host ($html.Substring([Math]::Max(0, $pos3 - 100), 300))
}
