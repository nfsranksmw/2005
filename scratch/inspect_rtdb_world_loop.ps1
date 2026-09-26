$ErrorActionPreference = 'Stop'

$baseUrl = 'https://nfsranks-blacklist-default-rtdb.firebaseio.com'
$data = Invoke-RestMethod -Uri "$baseUrl/leaderboards/nfs_world_loop.json" -Method Get

Write-Host "Firebase records for nfs_world_loop:"
foreach ($prop in $data.PSObject.Properties) {
    Write-Host "`nCategory: $($prop.Name)"
    $records = $prop.Value
    for ($i = 0; $i -lt [Math]::Min(10, $records.Count); $i++) {
        $r = $records[$i]
        Write-Host "  $($r.rank) | Driver: $($r.driver) | Time: '$($r.time)' | TimeMs: $($r.timeMs) | Car: $($r.car) | Video: $($r.yt)"
    }
}
