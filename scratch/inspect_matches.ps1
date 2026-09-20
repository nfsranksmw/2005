$svg1 = Get-Content -Raw -Encoding UTF8 scratch/test.svg
# Search for match containers or text positions in test.svg
$matches1 = [regex]::Matches($svg1, '<g[^>]*class="[^"]*match[^"]*"[^>]*>([\s\S]*?)<\/g>')
Write-Host "Match groups in SVG 1: $($matches1.Count)"

$svg2 = Get-Content -Raw -Encoding UTF8 scratch/ev1n0yug.svg
$matches2 = [regex]::Matches($svg2, '<g[^>]*class="[^"]*match[^"]*"[^>]*>([\s\S]*?)<\/g>')
Write-Host "Match groups in SVG 2: $($matches2.Count)"

# Let's inspect the first 3 matches of each
for ($i = 0; $i -lt [Math]::Min(3, $matches1.Count); $i++) {
    Write-Host "SVG1 Match $($i):"
    Write-Host $matches1[$i].Value
}
