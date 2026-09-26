$ErrorActionPreference = 'Stop'
$c = Get-Content 'assets/css/style.css' -Raw
$open = ([regex]::Matches($c, '\{')).Count
$close = ([regex]::Matches($c, '\}')).Count
Write-Host "style.css open braces: $open, close braces: $close"
