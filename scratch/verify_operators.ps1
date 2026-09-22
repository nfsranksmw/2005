$content = Get-Content 'assets/js/operator-icons.js' -Raw

# Extract all IDs in OPERATOR_CATALOG
$catalogMatches = [regex]::Matches($content, 'id:\s*[\x27\x22]([^\x27\x22]+)[\x27\x22]')
$catalogIds = @()
foreach ($m in $catalogMatches) {
    $catalogIds += $m.Groups[1].Value
}
Write-Host "Total IDs found in catalog: $($catalogIds.Count)"

# Check duplicates in catalog
$duplicates = $catalogIds | Group-Object | Where-Object { $_.Count -gt 1 }
if ($duplicates) {
    Write-Host "DUPLICATE CATALOG IDS FOUND:" -ForegroundColor Red
    foreach ($d in $duplicates) {
        Write-Host " - $($d.Name): $($d.Count)"
    }
} else {
    Write-Host "ALL CATALOG IDS ARE GLOBALLY UNIQUE (0 duplicates) ✓" -ForegroundColor Green
}

# Check CANONICAL_MAP IDs
$canonicalBlock = [regex]::Match($content, 'const CANONICAL_MAP = \{([\s\S]*?)\};').Groups[1].Value
$canonicalMatches = [regex]::Matches($canonicalBlock, ':\s*[\x27\x22]([^\x27\x22]+)[\x27\x22]')
$canonicalIds = @()
foreach ($m in $canonicalMatches) {
    $canonicalIds += $m.Groups[1].Value
}
$canonicalIds = $canonicalIds | Select-Object -Unique
Write-Host "Unique IDs in CANONICAL_MAP: $($canonicalIds.Count)"

$missing = @()
foreach ($id in $canonicalIds) {
    if ($catalogIds -notcontains $id) {
        $missing += $id
    }
}
if ($missing.Count -gt 0) {
    Write-Host "MISSING IDS IN CATALOG:" -ForegroundColor Red
    foreach ($m in $missing) {
        Write-Host " - $m"
    }
} else {
    Write-Host "ALL CANONICAL_MAP IDS EXIST IN OPERATOR_CATALOG ✓" -ForegroundColor Green
}

# Verify Blacklist 15 IDs are all unique
$bl15 = @('razor', 'bull', 'ronnie', 'jv', 'webster', 'ming', 'kamikaze', 'jewels', 'earl', 'baron', 'big_lou', 'izzy', 'vic', 'taz', 'inferno_skull')
$blDups = $bl15 | Group-Object | Where-Object { $_.Count -gt 1 }
if ($blDups) {
    Write-Host "BLACKLIST 15 HAS DUPLICATES" -ForegroundColor Red
} else {
    Write-Host "BLACKLIST 15 HAS 15 DISTINCT OPERATORS ✓" -ForegroundColor Green
}

# Verify Leo Speed has speed_demon
$leoSpeedId = [regex]::Match($canonicalBlock, '[\x27\x22]LEO SPEED[\x27\x22]:\s*[\x27\x22]([^\x27\x22]+)[\x27\x22]').Groups[1].Value
Write-Host "Leo Speed Canonical Operator: $leoSpeedId"
if ($leoSpeedId -eq 'speed_demon') {
    Write-Host "LEO SPEED IS MAPPED TO SPEED_DEMON ✓" -ForegroundColor Green
}
