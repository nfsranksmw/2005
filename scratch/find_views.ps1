$lines = Get-Content -Encoding UTF8 "index.html"
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match '<section\s+id=["''](view-guides|view-rules)["'']') {
        Write-Host "Line $($i+1): $($lines[$i])"
    }
}
