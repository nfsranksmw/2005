$f = Get-Item 'scratch/edge_dump.html'
Write-Host "Size: $($f.Length)"
$t = [System.IO.File]::ReadAllText('scratch/edge_dump.html', [System.Text.Encoding]::UTF8)
Write-Host "Contains Mike: $($t.Contains('Mike'))"
Write-Host "Contains youtube: $($t.Contains('youtube'))"

$matches = [regex]::Matches($t, 'https?://[^\s"<>\'']+') | Where-Object { $_.Value -match 'youtu|bilibili|twitch' }
Write-Host "Video links found: $($matches.Count)"
foreach ($m in $matches) {
    Write-Host " -> $($m.Value)"
}

# Print lines with 'Mike' or 'Lea4Speed0'
$lines = $t -split "`r?`n"
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'Mike' -or $lines[$i] -match 'Lea4Speed0') {
        Write-Host ("Line " + $i + ": " + $lines[$i])
    }
}
