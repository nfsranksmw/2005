$ErrorActionPreference = 'Stop'

$html = Get-Content 'index.html' -Raw -Encoding utf8

# Find all switchView('viewName') calls in index.html
$matches = [regex]::Matches($html, "switchView\(['""]([^'""]+)['""]\)")
$viewsReferenced = @()
foreach ($m in $matches) {
    $v = $m.Groups[1].Value
    if (-not ($viewsReferenced -contains $v)) {
        $viewsReferenced += $v
    }
}

Write-Host "Unique views referenced in index.html: $($viewsReferenced.Count)"

# Find all section IDs view-...
$secMatches = [regex]::Matches($html, 'id=["'']view-([^"'']+)["'']')
$existingSections = @()
foreach ($m in $secMatches) {
    $existingSections += $m.Groups[1].Value
}

Write-Host "Existing view sections in index.html: $($existingSections.Count)"

$missing = @()
foreach ($v in $viewsReferenced) {
    if (-not ($existingSections -contains $v)) {
        $missing += $v
    }
}

if ($missing.Count -eq 0) {
    Write-Host 'PERFECT! Every single switchView target has a corresponding view- section in index.html!' -ForegroundColor Green
    foreach ($v in $viewsReferenced) {
        Write-Host "  [OK] view-$v"
    }
} else {
    Write-Warning ('Missing sections: ' + ($missing -join ', '))
}
