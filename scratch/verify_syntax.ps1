# Validate JS files for basic syntax issues (brackets/braces match)
function Test-JsFile($path) {
    $content = Get-Content -Raw -Encoding UTF8 $path
    $openBraces = ($content.ToCharArray() | Where-Object { $_ -eq '{' }).Count
    $closeBraces = ($content.ToCharArray() | Where-Object { $_ -eq '}' }).Count
    $openParens = ($content.ToCharArray() | Where-Object { $_ -eq '(' }).Count
    $closeParens = ($content.ToCharArray() | Where-Object { $_ -eq ')' }).Count
    $openBrackets = ($content.ToCharArray() | Where-Object { $_ -eq '[' }).Count
    $closeBrackets = ($content.ToCharArray() | Where-Object { $_ -eq ']' }).Count
    
    Write-Host "File: $path"
    Write-Host "  Braces: { $openBraces | } $closeBraces (Diff: $($openBraces - $closeBraces))"
    Write-Host "  Parens: ( $openParens | ) $closeParens (Diff: $($openParens - $closeParens))"
    Write-Host "  Brackets: [ $openBrackets | ] $closeBrackets (Diff: $($openBrackets - $closeBrackets))"
}

Test-JsFile "assets/js/tournaments-data.js"
Test-JsFile "assets/js/blacklist-data.js"
Test-JsFile "assets/js/members-data.js"
Test-JsFile "assets/js/tuning-data.js"
Test-JsFile "assets/js/app.js"
Test-JsFile "assets/js/i18n.js"
