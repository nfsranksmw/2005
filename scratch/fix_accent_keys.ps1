$ErrorActionPreference = 'Stop'
$baseUrl = 'https://nfsranks-blacklist-default-rtdb.firebaseio.com'

$pairs = @(
    @{ Old = 'diamond___uni_n'; New = 'diamond___union' },
    @{ Old = 'uni_n___hollis'; New = 'union___hollis' },
    @{ Old = 'rockridge___uni_n'; New = 'rockridge___union' }
)

foreach ($p in $pairs) {
    $oldKey = $p.Old
    $newKey = $p.New
    $data = Invoke-RestMethod -Uri "$baseUrl/leaderboards/$oldKey.json" -Method Get
    if ($data) {
        $json = $data | ConvertTo-Json -Depth 10
        Invoke-RestMethod -Uri "$baseUrl/leaderboards/$newKey.json" -Method Put -Body $json -ContentType 'application/json; charset=utf-8' | Out-Null
        Write-Host "Copiado $oldKey -> $newKey con éxito."
    } else {
        Write-Warning "No data found for $oldKey"
    }
}
