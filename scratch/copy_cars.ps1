$src = 'C:\Users\willi\.gemini\antigravity\brain\0e31e6e6-08f9-4ae5-aa60-31bce533588b'
$dest = 'C:\Users\willi\.gemini\antigravity\scratch\nfs-mw-records\assets\img\cars'
if (!(Test-Path $dest)) {
    New-Item -ItemType Directory -Path $dest -Force | Out-Null
}

Copy-Item "$src\bmw_m3_gtr_studio_1789938618610.jpg" "$dest\bmw-m3-gtr.jpg" -Force
Copy-Item "$src\porsche_carrera_gt_1789938476632.jpg" "$dest\porsche-carrera-gt.jpg" -Force
Copy-Item "$src\lotus_elise_1789938490510.jpg" "$dest\lotus-elise.jpg" -Force
Copy-Item "$src\mitsubishi_lancer_evo_1789938505899.jpg" "$dest\mitsubishi-lancer-evo.jpg" -Force
Copy-Item "$src\subaru_impreza_wrx_1789938518975.jpg" "$dest\subaru-impreza-wrx.jpg" -Force
Copy-Item "$src\ford_mustang_gt_1789938532314.jpg" "$dest\ford-mustang-gt.jpg" -Force
Copy-Item "$src\chevy_cobalt_ss_1789938559486.jpg" "$dest\chevy-cobalt-ss.jpg" -Force
Copy-Item "$src\fiat_punto_1789938573194.jpg" "$dest\fiat-punto.jpg" -Force
Copy-Item "$src\mazda_rx8_1789938588111.jpg" "$dest\mazda-rx8.jpg" -Force
Copy-Item "$src\mercedes_slr_mclaren_1789938603426.jpg" "$dest\mercedes-slr-mclaren.jpg" -Force

Get-ChildItem $dest | ForEach-Object { "$($_.Name): $($_.Length) bytes" }
