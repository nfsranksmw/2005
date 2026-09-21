function Scale-FontSize($content) {
    $regex = [regex]'font-size:\s*([0-9\.]+)px'
    $evaluator = [System.Text.RegularExpressions.MatchEvaluator]{
        param($match)
        $orig = [double]$match.Groups[1].Value
        $scaled = [Math]::Round($orig * 0.90, 1)
        # Format: if integer, no decimal point
        $formatted = if ($scaled % 1 -eq 0) { [string][int]$scaled } else { [string]$scaled }
        return "font-size: ${formatted}px"
    }
    return $regex.Replace($content, $evaluator)
}

$css = Get-Content -Raw -Encoding UTF8 "assets/css/style.css"
$newCss = Scale-FontSize $css

# Check a few samples
$origMatches = [regex]::Matches($css, 'font-size:\s*([0-9\.]+)px')
$newMatches = [regex]::Matches($newCss, 'font-size:\s*([0-9\.]+)px')

Write-Host "Original matches: $($origMatches.Count) | New matches: $($newMatches.Count)"
for ($i = 0; $i -lt 10; $i++) {
    Write-Host "  $($origMatches[$i].Value) -> $($newMatches[$i].Value)"
}
