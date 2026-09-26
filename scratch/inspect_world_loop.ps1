$ErrorActionPreference = 'Stop'

$lines = Get-Content 'assets/js/routes-data.js' -Encoding utf8
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match 'World' -or $lines[$i] -match 'Loop' -or $lines[$i] -match 'NFS') {
        Write-Host "Line $($i+1): $($lines[$i])"
        for ($j = [Math]::Max(0, $i - 2); $j -lt [Math]::Min($lines.Count, $i + 15); $j++) {
            Write-Host ('{0,4}: {1}' -f ($j + 1), $lines[$j])
        }
        Write-Host "--------------------------------"
    }
}
