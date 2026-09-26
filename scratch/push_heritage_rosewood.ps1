$heritageRosewoodData = @{
    junkman = @(
        @{
            rank = "#1"
            driver = "ssjoen"
            time = "0m 21s 760ms"
            timeMs = 21760
            car = "Porsche Carrera GT"
            gearbox = "Manual"
            device = "PC"
            date = "hace 2 años"
            verified = $true
            yt = "https://youtu.be/hmh60H-t9Uw"
        },
        @{
            rank = "#2"
            driver = "InfacTus612"
            time = "0m 21s 960ms"
            timeMs = 21960
            car = "Porsche Carrera GT"
            gearbox = "Manual"
            device = "PC"
            date = "hace 4 años"
            verified = $true
            yt = "https://youtu.be/qGyp5PerHow"
        },
        @{
            rank = "#3"
            driver = "5TATIC"
            time = "0m 22s 122ms"
            timeMs = 22122
            car = "Porsche Carrera GT"
            gearbox = "Manual"
            device = "PC"
            date = "hace 5 años"
            verified = $true
            yt = "https://youtu.be/X8-GwCo6jpw"
        },
        @{
            rank = "#4"
            driver = "Proenke"
            time = "0m 23s 110ms"
            timeMs = 23110
            car = "Porsche Carrera GT"
            gearbox = "Manual"
            device = "PC"
            date = "hace 6 años"
            verified = $true
            yt = "https://www.youtube.com/watch?v=9SAqXhLX5h4"
        }
    )
    bmw = @(
        @{
            rank = "#1"
            driver = "ssjoen"
            time = "0m 26s 820ms"
            timeMs = 26820
            car = "BMW M3 GTR"
            gearbox = "Manual"
            device = "PC"
            date = "hace 2 años"
            verified = $true
            yt = "https://youtu.be/hmh60H-t9Uw"
        },
        @{
            rank = "#2"
            driver = "InfacTus612"
            time = "0m 27s 020ms"
            timeMs = 27020
            car = "BMW M3 GTR"
            gearbox = "Manual"
            device = "PC"
            date = "hace 4 años"
            verified = $true
            yt = "https://youtu.be/X7j6eHUI44I"
        },
        @{
            rank = "#3"
            driver = "TylerMRichards"
            time = "0m 27s 620ms"
            timeMs = 27620
            car = "BMW M3 GTR"
            gearbox = "Manual"
            device = "PC"
            date = "hace 4 años"
            verified = $true
            yt = "https://www.youtube.com/watch?v=SvTxCEyzSvY"
        }
    )
}

$jsonBody = $heritageRosewoodData | ConvertTo-Json -Depth 5
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
$bytes = $utf8NoBom.GetBytes($jsonBody)
[System.IO.File]::WriteAllBytes("scratch/heritage_rosewood_data.json", $bytes)

Write-Host "Uploading to Firebase RTDB..."
$url = "https://nfsranks-blacklist-default-rtdb.firebaseio.com/leaderboards/heritage___rosewood.json"
$res = curl.exe -s -X PUT -H "Content-Type: application/json" --data-binary "@scratch/heritage_rosewood_data.json" $url

Write-Host "Firebase RTDB Response:"
Write-Host $res
