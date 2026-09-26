$ErrorActionPreference = 'Stop'

$lines = Get-Content 'assets/js/app.js'
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'function initSubmitRouteSelector') {
        Write-Host "Found initSubmitRouteSelector at line $($i + 1)"
        for ($j = $i; $j -lt [Math]::Min($lines.Count, $i + 45); $j++) {
            Write-Host ('{0,4}: {1}' -f ($j + 1), $lines[$j])
        }
        break
    }
}
