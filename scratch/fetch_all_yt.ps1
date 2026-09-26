$runIds = @('ydrk84xz', 'mk91k7lz', 'zp0q27nm', 'zn83rv9z', 'mr13j58z', 'm3ov9vgm', 'm7pen1em')

foreach ($id in $runIds) {
    try {
        $raw = curl.exe -s --max-time 10 "https://www.speedrun.com/api/v1/runs/$id"
        $json = $raw | ConvertFrom-Json
        $yt = if ($json.data.videos.links) { $json.data.videos.links[0].uri } else { "" }
        Write-Host "$id => $yt"
    } catch {
        Write-Host "$id => ERROR: $_"
    }
}
