$ErrorActionPreference = 'Stop'

$code = Get-Content 'assets/js/app.js' -Raw -Encoding utf8
$len = $code.Length

# Accurate state machine:
# States:
# 0 = normal code
# 1 = single line comment (//)
# 2 = multiline comment (/* */)
# 3 = single quote string ('')
# 4 = double quote string ("")
# 5 = template string (``)
# 6 = regex literal (//)

$state = 0
$templateDepth = 0
$escaped = $false
$stack = New-Object System.Collections.Generic.Stack[PSCustomObject]
$line = 1
$col = 1
$lastNonWhitespaceToken = ''

for ($i = 0; $i -lt $len; $i++) {
    $c = $code[$i]
    $next = if ($i + 1 -lt $len) { $code[$i + 1] } else { [char]0 }

    if ($c -eq "`n") {
        $line++
        $col = 1
        if ($state -eq 1) { $state = 0 } # end of line comment
        $escaped = $false
        continue
    }
    $col++

    if ($state -eq 1) { continue } # in // comment

    if ($state -eq 2) { # in /* comment
        if ($c -eq '*' -and $next -eq '/') {
            $state = 0
            $i++
            $col++
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

    if ($state -eq 3) { # in 'string'
        if ($c -eq "'") { $state = 0; $lastNonWhitespaceToken = 'STRING' }
        continue
    }

    if ($state -eq 4) { # in "string"
        if ($c -eq '"') { $state = 0; $lastNonWhitespaceToken = 'STRING' }
        continue
    }

    if ($state -eq 5) { # in `template`
        if ($c -eq '`') { $state = 0; $lastNonWhitespaceToken = 'STRING' }
        elseif ($c -eq '$' -and $next -eq '{') {
            # Template expression starts!
            $stack.Push([PSCustomObject]@{ Type = 'TEMPLATE_EXPR'; Line = $line; Col = $col; Snippet = '${...' })
            $i++
            $col++
            $state = 0
        }
        continue
    }

    if ($state -eq 6) { # in /regex/
        if ($c -eq '/') { $state = 0; $lastNonWhitespaceToken = 'REGEX' }
        continue
    }

    # STATE 0 (Normal code)
    if ($c -eq '/' -and $next -eq '/') {
        $state = 1
        $i++
        $col++
        continue
    }
    if ($c -eq '/' -and $next -eq '*') {
        $state = 2
        $i++
        $col++
        continue
    }
    if ($c -eq "'") { $state = 3; continue }
    if ($c -eq '"') { $state = 4; continue }
    if ($c -eq '`') { $state = 5; continue }

    if ($c -eq '/') {
        # Is it division or regex?
        # If previous token is an operator or keyword or start of statement, it's regex!
        if ($lastNonWhitespaceToken -match '(=|\(|,|\[|:|\?|!|return|case|typeof|delete|void|throw)$' -or [string]::IsNullOrEmpty($lastNonWhitespaceToken)) {
            $state = 6
            continue
        }
    }

    if (-not [char]::IsWhiteSpace($c)) {
        if ($c -eq '{') {
            $snippet = if ($i + 40 -lt $len) { $code.Substring($i, 40).Replace("`r", "").Replace("`n", " ") } else { "" }
            $stack.Push([PSCustomObject]@{ Type = 'BRACE'; Line = $line; Col = $col; Snippet = $snippet })
            $lastNonWhitespaceToken = '{'
        }
        elseif ($c -eq '}') {
            if ($stack.Count -gt 0) {
                $top = $stack.Pop()
                if ($top.Type -eq 'TEMPLATE_EXPR') {
                    $state = 5 # resume template string
                }
            } else {
                Write-Warning "Extra closing brace at line $line, col $col"
            }
            $lastNonWhitespaceToken = '}'
        }
        else {
            $lastNonWhitespaceToken += $c
            if ($lastNonWhitespaceToken.Length -gt 20) {
                $lastNonWhitespaceToken = $lastNonWhitespaceToken.Substring($lastNonWhitespaceToken.Length - 20)
            }
        }
    }
}

Write-Host "Unclosed items count: $($stack.Count)"
foreach ($item in $stack) {
    Write-Host "Unclosed $($item.Type) at line $($item.Line), col $($item.Col): $($item.Snippet)"
}
