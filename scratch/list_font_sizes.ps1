$content = Get-Content -Raw -Encoding UTF8 "assets/css/style.css"
$regex = [regex]'font-size:\s*([0-9\.]+)px'
$matches = $regex.Matches($content)

$sizes = @{}
foreach ($m in $matches) {
    $val = [double]$m.Groups[1].Value
    if (-not $sizes.ContainsKey($val)) {
        $sizes[$val] = 0
    }
    $sizes[$val]++
}

$sortedKeys = $sizes.Keys | Sort-Object
foreach ($k in $sortedKeys) {
    $newVal = [Math]::Round($k * 0.90, 1)
    Write-Host "$($k)px -> $($newVal)px  (Count: $($sizes[$k]))"
}

Write-Host "Total font-size occurrences: $($matches.Count)"
