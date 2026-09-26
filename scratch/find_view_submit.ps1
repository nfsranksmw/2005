$ErrorActionPreference = 'Stop'

$lines = Get-Content 'index.html'
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'id=["'']view-submit["'']') {
        Write-Host "Found view-submit at line $($i + 1)"
        for ($j = $i; $j -lt [Math]::Min($lines.Count, $i + 100); $j++) {
            Write-Host ('{0,4}: {1}' -f ($j + 1), $lines[$j])
        }
        break
    }
}
