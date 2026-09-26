$ErrorActionPreference = 'Stop'

$bytes = [System.IO.File]::ReadAllBytes('assets/js/app.js')
$nullCount = 0
for ($i = 0; $i -lt $bytes.Length; $i++) {
    if ($bytes[$i] -eq 0) { $nullCount++ }
}
Write-Host "Total bytes: $($bytes.Length)"
Write-Host "Null bytes: $nullCount"

# Also check for initSubmitRouteSelector in app.js
$text = [System.Text.Encoding]::UTF8.GetString($bytes)
$hasInit = $text.Contains('initSubmitRouteSelector')
Write-Host "Contains initSubmitRouteSelector: $hasInit"

$hasMask = $text.Contains('applyRaceTimeMask')
Write-Host "Contains applyRaceTimeMask: $hasMask"
