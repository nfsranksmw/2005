$ErrorActionPreference = 'Stop'
$baseUrl = 'https://nfsranks-blacklist-default-rtdb.firebaseio.com'

$routes = Invoke-RestMethod -Uri "$baseUrl/leaderboards.json?shallow=true" -Method Get
$routeKeys = @($routes.PSObject.Properties.Name)
Write-Host "Total route keys in RTDB: $($routeKeys.Count)"

Write-Host "Sample 10 keys:"
$routeKeys | Select-Object -First 10 | ForEach-Object { Write-Host " - $_" }

$bayshoreKeys = $routeKeys | Where-Object { $_ -like '*bayshore*' }
Write-Host "Bayshore keys: $($bayshoreKeys -join ', ')"

foreach ($k in $bayshoreKeys) {
    $data = Invoke-RestMethod -Uri "$baseUrl/leaderboards/$k.json" -Method Get
    Write-Host "Data for $k :"
    if ($data) {
        foreach ($prop in $data.PSObject.Properties) {
            Write-Host "   Category $($prop.Name): count = $(@($prop.Value).Count)"
            if (@($prop.Value).Count -gt 0) {
                $first = $prop.Value[0]
                Write-Host "     #1: $($first.rank) $($first.driver) ($($first.time))"
            }
        }
    }
}

