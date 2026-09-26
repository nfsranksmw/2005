$ErrorActionPreference = 'Stop'
$baseUrl = 'https://nfsranks-blacklist-default-rtdb.firebaseio.com'

# Read routes-data.js
$routesContent = Get-Content 'assets/js/routes-data.js' -Raw -Encoding utf8
# Extract names: name: "..."
$matches = [regex]::Matches($routesContent, 'name\s*:\s*["'']([^"'']+)["'']')
$routeNames = @()
foreach ($m in $matches) {
    $routeNames += $m.Groups[1].Value
}

Write-Host "Found $($routeNames.Count) routes in routes.js"

$rtdbKeys = @((Invoke-RestMethod -Uri "$baseUrl/leaderboards.json?shallow=true").PSObject.Properties.Name)
Write-Host "Found $($rtdbKeys.Count) keys in Firebase RTDB"

function Sanitize-JS([string]$str) {
    # Emulate JS normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9_-]/g, '_')
    $norm = $str.Normalize([System.Text.NormalizationForm]::FormD)
    $sb = New-Object System.Text.StringBuilder
    foreach ($c in $norm.ToCharArray()) {
        $cat = [System.Globalization.CharUnicodeInfo]::GetUnicodeCategory($c)
        if ($cat -ne [System.Globalization.UnicodeCategory]::NonSpacingMark) {
            [void]$sb.Append($c)
        }
    }
    $clean = $sb.ToString().ToLower()
    $clean = [System.Text.RegularExpressions.Regex]::Replace($clean, '[^a-z0-9_-]', '_')
    return $clean
}

$mismatches = @()
foreach ($name in $routeNames) {
    $jsKey = Sanitize-JS $name
    if (-not ($rtdbKeys -contains $jsKey)) {
        # Check if there is an alternative key in RTDB
        $alt = $rtdbKeys | Where-Object { $_ -like "*$($jsKey.Substring(0, [Math]::Min(5, $jsKey.Length)))*" }
        $mismatches += [PSCustomObject]@{
            Name = $name
            ExpectedJSKey = $jsKey
            MatchingRTDB = ($alt -join ', ')
        }
    }
}

if ($mismatches.Count -eq 0) {
    Write-Host "PERFECT! All $($routeNames.Count) routes in routes.js match exact keys in Firebase RTDB!" -ForegroundColor Green
} else {
    Write-Host "Found $($mismatches.Count) mismatches:" -ForegroundColor Yellow
    $mismatches | Format-Table -AutoSize
}
