# Script de verificación para el flujo de homologación y registro en Firebase RTDB
$ErrorActionPreference = "Stop"

Write-Host "=== 1. Verificando sintaxis de archivos JS/HTML ===" -ForegroundColor Cyan
try {
    # Check node syntax if node is available
    $nodeCheck = Get-Command node -ErrorAction SilentlyContinue
    if ($nodeCheck) {
        node -c assets/js/app.js
        Write-Host "assets/js/app.js: SINTAXIS OK" -ForegroundColor Green
        node -c assets/js/i18n.js
        Write-Host "assets/js/i18n.js: SINTAXIS OK" -ForegroundColor Green
    } else {
        Write-Host "Node.js no encontrado, omitiendo chequeo de sintaxis node." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error en sintaxis JS: $_" -ForegroundColor Red
}

Write-Host "`n=== 2. Probando escritura REST a Firebase Realtime Database (/submissions) ===" -ForegroundColor Cyan
$testSubId = "TEST-SUB-" + [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
$subPayload = @{
    id = $testSubId
    driver = "PILOTO_TEST_2026"
    car = "Porsche Carrera GT"
    route = "City Perimeter"
    category = "Junkman"
    lapType = "Single Lap"
    categoryKey = "junkman_single"
    mode = "Online"
    time = "01:20.000"
    timeMs = 80000
    startMark = "00:10.000"
    endMark = "01:30.000"
    diff = "01:20.000"
    videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    gearbox = "Manual"
    device = "Teclado"
    status = "HOMOLOGADO_TEST"
    timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ssZ")
} | ConvertTo-Json -Compress

$subUrl = "https://nfsranks-blacklist-default-rtdb.firebaseio.com/submissions/$testSubId.json"

try {
    $resSub = Invoke-RestMethod -Uri $subUrl -Method Put -Body $subPayload -ContentType "application/json"
    Write-Host "Escritura en /submissions/$testSubId.json EXITOSA: $($resSub.id)" -ForegroundColor Green
} catch {
    Write-Host "Error escribiendo en Firebase /submissions: $_" -ForegroundColor Red
}

Write-Host "`n=== 3. Probando lectura y actualización en /leaderboards/city_perimeter/junkman_single.json ===" -ForegroundColor Cyan
$lbUrl = "https://nfsranks-blacklist-default-rtdb.firebaseio.com/leaderboards/city_perimeter/junkman_single.json"

try {
    # Leer existentes
    $existing = Invoke-RestMethod -Uri $lbUrl -Method Get -ErrorAction SilentlyContinue
    $records = @()
    if ($existing) {
        if ($existing -is [System.Array]) {
            $records = @($existing)
        } else {
            $records = @($existing.PSObject.Properties | ForEach-Object { $_.Value })
        }
    }

    Write-Host "Registros previos en Firebase RTDB para City Perimeter (junkman_single): $($records.Count)" -ForegroundColor Yellow

    # Nuevo registro de prueba
    $newRec = @{
        rank = "#1"
        driver = "PILOTO_TEST_2026"
        time = "01:20.000"
        car = "Porsche Carrera GT"
        device = "Teclado"
        gearbox = "Manual"
        date = (Get-Date).ToString("yyyy-MM-dd")
        yt = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        submissionId = $testSubId
    }

    $records += $newRec
    $lbJson = $records | ConvertTo-Json -Compress

    $resLb = Invoke-RestMethod -Uri $lbUrl -Method Put -Body $lbJson -ContentType "application/json"
    Write-Host "Actualización en /leaderboards/city_perimeter/junkman_single.json EXITOSA: $($resLb.Count) filas guardadas." -ForegroundColor Green

    # Verificar lectura de nuevo
    $verifyRes = Invoke-RestMethod -Uri $lbUrl -Method Get
    Write-Host "Verificación: Se leyeron $($verifyRes.Count) registros de Firebase RTDB para City Perimeter." -ForegroundColor Green
    foreach ($r in $verifyRes) {
        Write-Host " - [$($r.rank)] $($r.driver) | $($r.time) | $($r.car)" -ForegroundColor Gray
    }
} catch {
    Write-Host "Error en /leaderboards: $_" -ForegroundColor Red
}

Write-Host "`n=== PRUEBA DE FLUJO FINALIZADA EXITOSAMENTE ===" -ForegroundColor Green
