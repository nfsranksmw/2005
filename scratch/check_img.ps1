Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile((Resolve-Path "assets/img/rockport-map-live.jpg"))
Write-Host "Width: $($img.Width) | Height: $($img.Height) | Aspect: $([Math]::Round($img.Width / $img.Height, 2))"
$img.Dispose()
