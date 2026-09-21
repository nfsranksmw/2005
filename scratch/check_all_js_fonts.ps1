$files = Get-ChildItem -Path "assets/js" -Filter "*.js"
foreach ($f in $files) {
    $content = Get-Content -Raw -Encoding UTF8 $f.FullName
    $m = [regex]::Matches($content, 'font-size:\s*([0-9\.]+)px')
    if ($m.Count -gt 0) {
        Write-Host "$($f.Name): $($m.Count) font-size occurrences"
    }
}
