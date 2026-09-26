$ErrorActionPreference = 'Stop'

$lines = Get-Content 'assets/css/style.css'
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '\.discord-floating-panel') {
        Write-Host ('{0,5}: {1}' -f ($i + 1), $lines[$i])
    }
}
