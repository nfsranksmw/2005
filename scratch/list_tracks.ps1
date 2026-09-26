$content = Get-Content assets/js/routes-data.js -Raw
$pattern = 'name:\s*"([^"]+)",[\s\r\n]*(?:alias:[^,]+,[\s\r\n]*)?type:\s*"([^"]+)"'
$matches = [regex]::Matches($content, $pattern)
$circuits = @()
$sprints = @()
foreach ($m in $matches) {
    if ($m.Groups[2].Value -eq 'Circuito') { $circuits += $m.Groups[1].Value }
    if ($m.Groups[2].Value -eq 'Sprint') { $sprints += $m.Groups[1].Value }
}
Write-Host "Circuits ($($circuits.Count)):"
$circuits | ForEach-Object { Write-Host "  $_" }
Write-Host "`nSprints ($($sprints.Count)):"
$sprints | ForEach-Object { Write-Host "  $_" }
