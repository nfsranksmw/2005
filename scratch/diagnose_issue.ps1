$ErrorActionPreference = 'Stop'

$lines = Get-Content 'assets/js/app.js'
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'function switchView') {
        Write-Host "switchView found at line $($i + 1)"
        for ($j = $i; $j -lt [Math]::Min($lines.Count, $i + 80); $j++) {
            Write-Host ('{0,4}: {1}' -f ($j + 1), $lines[$j])
        }
        break
    }
}
