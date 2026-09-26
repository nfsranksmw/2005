$baseUrl = 'https://nfsranks-blacklist-default-rtdb.firebaseio.com'
$d = Invoke-RestMethod -Uri "$baseUrl/leaderboards/ironwood_states.json"

Write-Host "Firebase RTDB for ironwood_states:"
foreach ($p in $d.PSObject.Properties) {
    Write-Host "`nCategory: $($p.Name)"
    $recs = $p.Value
    for ($i = 0; $i -lt [Math]::Min(5, $recs.Count); $i++) {
        $r = $recs[$i]
        Write-Host "  $($r.rank) | Driver: $($r.driver) | Time: $($r.time) | Video: $($r.yt)"
    }
}
