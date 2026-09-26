$ErrorActionPreference = 'Stop'

$lines = Get-Content 'assets/js/app.js'
$depth = 0

for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    
    # Strip comments and string literals to count braces accurately
    # Simple heuristic: remove // comments and string content
    $clean = [regex]::Replace($line, '//.*$', '')
    $clean = [regex]::Replace($clean, '`.*?`', '')
    $clean = [regex]::Replace($clean, '".*?"', '')
    $clean = [regex]::Replace($clean, "'.*?'", '')

    $open = ([regex]::Matches($clean, '\{')).Count
    $close = ([regex]::Matches($clean, '\}')).Count
    
    $prevDepth = $depth
    $depth += ($open - $close)
    
    if ($depth -lt 0) {
        Write-Warning "Negative brace depth at line $($i + 1): depth=$depth. Line: $line"
    }
}

Write-Host "Final brace depth at end of app.js: $depth"
