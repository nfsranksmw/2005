$ErrorActionPreference = 'Stop'

# Tokenize JS characters properly handling multiline strings and regex
$code = Get-Content 'assets/js/app.js' -Raw -Encoding utf8

$inSingleQuote = $false
$inDoubleQuote = $false
$inBacktick = $false
$inLineComment = $false
$inBlockComment = $false
$escaped = $false

$stack = New-Object System.Collections.Generic.Stack[PSCustomObject]
$line = 1
$col = 1

for ($i = 0; $i -lt $code.Length; $i++) {
    $c = $code[$i]
    $next = if ($i + 1 -lt $code.Length) { $code[$i + 1] } else { [char]0 }

    if ($c -eq "`n") {
        $line++
        $col = 1
        $inLineComment = $false
        $escaped = $false
        continue
    }
    $col++

    if ($inLineComment) { continue }

    if ($inBlockComment) {
        if ($c -eq '*' -and $next -eq '/') {
            $inBlockComment = $false
            $i++
        }
        continue
    }

    if ($escaped) {
        $escaped = $false
        continue
    }

    if ($c -eq '\') {
        $escaped = $true
        continue
    }

    if ($inSingleQuote) {
        if ($c -eq "'") { $inSingleQuote = $false }
        continue
    }

    if ($inDoubleQuote) {
        if ($c -eq '"') { $inDoubleQuote = $false }
        continue
    }

    if ($inBacktick) {
        if ($c -eq '`') { $inBacktick = $false }
        continue
    }

    # Not in string or comment
    if ($c -eq '/' -and $next -eq '/') {
        $inLineComment = $true
        $i++
        continue
    }
    if ($c -eq '/' -and $next -eq '*') {
        $inBlockComment = $true
        $i++
        continue
    }

    if ($c -eq "'") { $inSingleQuote = $true; continue }
    if ($c -eq '"') { $inDoubleQuote = $true; continue }
    if ($c -eq '`') { $inBacktick = $true; continue }

    if ($c -eq '{') {
        $snippet = if ($i + 30 -lt $code.Length) { $code.Substring($i, 30).Replace("`n", ' ') } else { '' }
        $stack.Push([PSCustomObject]@{ Line = $line; Col = $col; Snippet = $snippet })
    }
    elseif ($c -eq '}') {
        if ($stack.Count -gt 0) {
            $void = $stack.Pop()
        } else {
            Write-Warning "Extra closing brace at line $line, col $col"
        }
    }
}

Write-Host "Unclosed braces count: $($stack.Count)"
foreach ($unclosed in $stack) {
    Write-Host "Unclosed brace opened at line $($unclosed.Line), col $($unclosed.Col): $($unclosed.Snippet)"
}
