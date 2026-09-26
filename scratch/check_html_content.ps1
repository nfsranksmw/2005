$html = [System.IO.File]::ReadAllText('scratch/nfs_world_loop.html', [System.Text.Encoding]::UTF8)

Write-Host ("Has X1PROCL? " + $html.Contains('X1PROCL'))
Write-Host ("Has HighPriest? " + $html.Contains('HighPriest'))
Write-Host ("Has iframe? " + $html.Contains('iframe'))
Write-Host ("Has sheets-viewport? " + $html.Contains('sheets-viewport'))

# Let's see the last 2000 characters of the file
$endLen = [Math]::Min(2000, $html.Length)
Write-Host "Tail of file:"
Write-Host ($html.Substring($html.Length - $endLen))
