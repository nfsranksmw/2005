$ErrorActionPreference = 'Stop'

$lines = Get-Content 'assets/js/app.js'
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'function applyRaceTimeMask' -or $lines[$i] -match 'function validateTimeMarksLive') {
        Write-Host "Found $($lines[$i]) at line $($i + 1)"
    }
}
