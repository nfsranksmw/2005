$content = Get-Content -Raw -Encoding UTF8 "assets/js/app.js"
$regex = [regex]'font-size:\s*([0-9\.]+)px'
$matches = $regex.Matches($content)
Write-Host "Inline font-sizes in app.js: $($matches.Count)"
$sizes = @{}
foreach ($m in $matches) {
    $val = [double]$m.Groups[1].Value
    if (-not $sizes.ContainsKey($val)) { $sizes[$val] = 0 }
    $sizes[$val]++
}
foreach ($k in ($sizes.Keys | Sort-Object)) {
    Write-Host "  $($k)px : $($sizes[$k])"
}
