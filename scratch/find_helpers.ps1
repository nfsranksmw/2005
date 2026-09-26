$ErrorActionPreference = 'Stop'

$lines = Get-Content 'assets/js/app.js'
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'function handleCategoryOrRouteChange' -or $lines[$i] -match 'function handleVideoUrlChange') {
        Write-Host "Found $($lines[$i]) at line $($i + 1)"
    }
}
