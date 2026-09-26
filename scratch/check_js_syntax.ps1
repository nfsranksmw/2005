$ErrorActionPreference = 'Stop'

# Test syntax of all js files using JScript or Microsoft.ClearScript if available, or regex/bracket matching
$files = Get-ChildItem -Path 'assets/js' -Filter '*.js'

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding utf8
    Write-Host "Checking $($file.Name) (Length: $($content.Length))..."
    
    # Check mismatched braces and parentheses
    $openBraces = ([regex]::Matches($content, '\{')).Count
    $closeBraces = ([regex]::Matches($content, '\}')).Count
    if ($openBraces -ne $closeBraces) {
        Write-Warning "BRACE MISMATCH in $($file.Name): open=$openBraces, close=$closeBraces"
    }

    $openParens = ([regex]::Matches($content, '\(')).Count
    $closeParens = ([regex]::Matches($content, '\)')).Count
    if ($openParens -ne $closeParens) {
        Write-Warning "PAREN MISMATCH in $($file.Name): open=$openParens, close=$closeParens"
    }

    $openBrackets = ([regex]::Matches($content, '\[')).Count
    $closeBrackets = ([regex]::Matches($content, '\]')).Count
    if ($openBrackets -ne $closeBrackets) {
        Write-Warning "BRACKET MISMATCH in $($file.Name): open=$openBrackets, close=$closeBrackets"
    }
}
Write-Host "Brace check done."
