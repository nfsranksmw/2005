function Scale-FontSize($text) {
    $regex = [regex]'font-size:\s*([0-9\.]+)px'
    $evaluator = [System.Text.RegularExpressions.MatchEvaluator]{
        param($match)
        $orig = [double]$match.Groups[1].Value
        $scaled = [Math]::Round($orig * 0.90, 1)
        # If integer, format without decimal point
        $formatted = if ($scaled % 1 -eq 0) { [string][int]$scaled } else { [string]$scaled }
        return "font-size: ${formatted}px"
    }
    return $regex.Replace($text, $evaluator)
}

# 1. assets/css/style.css
$cssPath = "assets/css/style.css"
$css = Get-Content -Raw -Encoding UTF8 $cssPath
$newCss = Scale-FontSize $css

# Scale line-height: 1.5 -> 1.4 and letter-spacing: 0.2px -> 0.15px
$newCss = $newCss.Replace("line-height: 1.5;", "line-height: 1.4;")
$newCss = $newCss.Replace("letter-spacing: 0.2px;", "letter-spacing: 0.15px;")

[System.IO.File]::WriteAllText((Resolve-Path $cssPath), $newCss, [System.Text.Encoding]::UTF8)
Write-Host "Updated $cssPath"

# 2. index.html
$htmlPath = "index.html"
$html = Get-Content -Raw -Encoding UTF8 $htmlPath
$newHtml = Scale-FontSize $html
[System.IO.File]::WriteAllText((Resolve-Path $htmlPath), $newHtml, [System.Text.Encoding]::UTF8)
Write-Host "Updated $htmlPath"

# 3. assets/js/app.js
$jsPath = "assets/js/app.js"
$js = Get-Content -Raw -Encoding UTF8 $jsPath
$newJs = Scale-FontSize $js
[System.IO.File]::WriteAllText((Resolve-Path $jsPath), $newJs, [System.Text.Encoding]::UTF8)
Write-Host "Updated $jsPath"
