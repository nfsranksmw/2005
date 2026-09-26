# NFSRANKSMW - Script de Migración Histórica de Google Sheets a Firebase Realtime Database
# Extrae datos vía OpenXML (XLSX) para capturar hipervínculos reales de YouTube/Twitch/Bilibili
# y analiza tiempos con soporte para formatos como 4.56.26, 4:53.36, 35:42:00, etc.

$ErrorActionPreference = 'Continue'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Add-Type -AssemblyName System.IO.Compression

$FirebaseBaseUrl = 'https://nfsranks-blacklist-default-rtdb.firebaseio.com'

function Parse-TimeToMs([string]$timeStr) {
    if ([string]::IsNullOrWhiteSpace($timeStr)) { return $null }
    $clean = $timeStr.Trim()
    if ($clean -eq '--' -or $clean -eq '-' -or $clean -eq 'N/A' -or $clean -eq 'none') { return $null }

    # Formato texto: "0m 24s 010ms" o "19s 810ms"
    if ($clean -match '(?i)(?:(\d+)m)?\s*(\d+)s\s*(\d+)?') {
        $m = if ($Matches[1]) { [int]$Matches[1] } else { 0 }
        $s = if ($Matches[2]) { [int]$Matches[2] } else { 0 }
        $msRaw = if ($Matches[3]) { $Matches[3] } else { '0' }
        if ($msRaw.Length -eq 1) { $msRaw += '00' }
        elseif ($msRaw.Length -eq 2) { $msRaw += '0' }
        elseif ($msRaw.Length -gt 3) { $msRaw = $msRaw.Substring(0, 3) }
        return ($m * 60000) + ($s * 1000) + [int]$msRaw
    }

    # Formato con dos puntos decimales: "4.56.26" o "4.59.04" (minutos.segundos.centésimas)
    if ($clean -match '^(\d+)\.(\d{1,2})\.(\d+)$') {
        $mins = [int]$Matches[1]
        $secs = [int]$Matches[2]
        $msRaw = $Matches[3]
        if ($msRaw.Length -eq 1) { $msRaw += '00' }
        elseif ($msRaw.Length -eq 2) { $msRaw += '0' }
        elseif ($msRaw.Length -gt 3) { $msRaw = $msRaw.Substring(0, 3) }
        return ($mins * 60000) + ($secs * 1000) + [int]$msRaw
    }

    # Formato "SS:xx:00" donde SS < 60 (ej: 35:42:00 en vueltas cortas)
    if ($clean -match '^(\d{1,2}):(\d{1,2}):(\d{2})$') {
        $p1 = [int]$Matches[1]
        $p2 = [int]$Matches[2]
        $p3 = [int]$Matches[3]
        if ($p3 -eq 0 -and $p1 -lt 60) {
            $msRaw = $Matches[2]
            if ($msRaw.Length -eq 1) { $msRaw += '00' }
            elseif ($msRaw.Length -eq 2) { $msRaw += '0' }
            return ($p1 * 1000) + [int]$msRaw
        }
        return ($p1 * 3600000) + ($p2 * 60000) + ($p3 * 1000)
    }

    # Formato "M:SS.xxx" o "MM:SS.xxx" o "M:SS"
    if ($clean.Contains(':')) {
        $parts = $clean.Split(':')
        $mins = [int]$parts[0]
        $secParts = $parts[1].Split('.')
        $secs = [int]$secParts[0]
        $msStr = if ($secParts.Length -gt 1) { $secParts[1] } else { '0' }
        if ($msStr.Length -eq 1) { $msStr += '00' }
        elseif ($msStr.Length -eq 2) { $msStr += '0' }
        elseif ($msStr.Length -gt 3) { $msStr = $msStr.Substring(0, 3) }
        $ms = [int]$msStr
        return ($mins * 60000) + ($secs * 1000) + $ms
    }

    # Formato "SS.xxx" (segundos y milésimas)
    if ($clean.Contains('.')) {
        $secParts = $clean.Split('.')
        $secs = [int]$secParts[0]
        $msStr = if ($secParts.Length -gt 1) { $secParts[1] } else { '0' }
        if ($msStr.Length -eq 1) { $msStr += '00' }
        elseif ($msStr.Length -eq 2) { $msStr += '0' }
        elseif ($msStr.Length -gt 3) { $msStr = $msStr.Substring(0, 3) }
        $ms = [int]$msStr
        return ($secs * 1000) + $ms
    }

    # Entero simple de segundos
    if ($clean -match '^\d+$') {
        return [int]$clean * 1000
    }

    return $null
}

function Sanitize-Key([string]$str) {
    if ([string]::IsNullOrWhiteSpace($str)) { return 'general' }
    $clean = $str.Trim().ToLower()
    $clean = [System.Text.RegularExpressions.Regex]::Replace($clean, '[^a-z0-9_-]', '_')
    return $clean
}

function Process-SheetUrl([string]$sheetUrl) {
    # 1. Intentar extracción completa vía XLSX (OpenXML) para hipervínculos
    $xlsxUrl = $sheetUrl -replace 'output=csv', 'output=xlsx'
    if (-not $xlsxUrl.Contains('output=xlsx')) {
        $xlsxUrl = $xlsxUrl + '&output=xlsx'
    }

    try {
        $wc = New-Object System.Net.WebClient
        $wc.Headers.Add('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)')
        $bytes = $wc.DownloadData($xlsxUrl)
        if ($bytes.Length -gt 1000) {
            $memStream = New-Object System.IO.MemoryStream(, $bytes)
            $zip = New-Object System.IO.Compression.ZipArchive($memStream, [System.IO.Compression.ZipArchiveMode]::Read)

            # Leer shared strings usando InnerText para evitar System.Xml.XmlElement en texto enriquecido
            $sstEntry = $zip.GetEntry('xl/sharedStrings.xml')
            $sst = @()
            if ($sstEntry) {
                $reader = New-Object System.IO.StreamReader($sstEntry.Open(), [System.Text.Encoding]::UTF8)
                [xml]$ssXml = $reader.ReadToEnd()
                $reader.Close()
                foreach ($si in $ssXml.sst.si) {
                    $sst += $si.InnerText
                }
            }

            # Leer relaciones de hipervínculos (_rels/sheet1.xml.rels)
            $relsEntry = $zip.GetEntry('xl/worksheets/_rels/sheet1.xml.rels')
            $relTargetMap = @{}
            if ($relsEntry) {
                $reader = New-Object System.IO.StreamReader($relsEntry.Open(), [System.Text.Encoding]::UTF8)
                [xml]$rXml = $reader.ReadToEnd()
                $reader.Close()
                foreach ($rel in $rXml.Relationships.Relationship) {
                    $relTargetMap[$rel.Id] = $rel.Target
                }
            }

            # Leer hoja de cálculo (sheet1.xml)
            $sheetEntry = $zip.GetEntry('xl/worksheets/sheet1.xml')
            if ($sheetEntry) {
                $reader = New-Object System.IO.StreamReader($sheetEntry.Open(), [System.Text.Encoding]::UTF8)
                [xml]$sXml = $reader.ReadToEnd()
                $reader.Close()

                $linkMap = @{}
                if ($sXml.worksheet.hyperlinks) {
                    foreach ($hl in $sXml.worksheet.hyperlinks.hyperlink) {
                        $rId = $hl.id
                        if (-not $rId) { $rId = $hl.GetAttribute('r:id') }
                        if ($relTargetMap.ContainsKey($rId)) {
                            $linkMap[$hl.ref] = $relTargetMap[$rId]
                        }
                    }
                }

                $zip.Dispose()
                $memStream.Dispose()

                # Detectar dinámicamente columnas de cabecera
                $headerFound = $false
                $colMap = @{
                    driver = 'B'
                    time = 'C'
                    device = 'D'
                    car = 'E'
                    gearbox = 'F'
                    date = 'G'
                    video = 'H'
                }

                $records = @()
                foreach ($row in $sXml.worksheet.sheetData.row) {
                    $rowNum = [int]$row.r
                    $rowCells = @{}
                    foreach ($c in $row.c) {
                        $ref = $c.r
                        $colLetter = [regex]::Match($ref, '^[A-Z]+').Value
                        $val = ''
                        if ($c.t -eq 's') {
                            $idx = [int]$c.v
                            if ($idx -lt $sst.Count) { $val = $sst[$idx] }
                        } elseif ($c.v) {
                            $val = $c.v
                        }
                        $rowCells[$colLetter] = $val
                    }

                    $allValues = ($rowCells.Values | ForEach-Object { "$_".ToLower().Trim() }) -join ' '
                    if (-not $headerFound) {
                        if ($allValues -match 'driver|player|piloto' -and $allValues -match 'time|tiempo') {
                            $headerFound = $true
                            foreach ($colKey in $rowCells.Keys) {
                                $headerText = "$($rowCells[$colKey])".ToLower().Trim()
                                if ($headerText -match 'driver|player|piloto') { $colMap['driver'] = $colKey }
                                elseif ($headerText -match '^time|^tiempo') { $colMap['time'] = $colKey }
                                elseif ($headerText -match 'device|dispositivo|mando|input') { $colMap['device'] = $colKey }
                                elseif ($headerText -match 'car|vehic|auto|coche') { $colMap['car'] = $colKey }
                                elseif ($headerText -match 'gear|caja|trans') { $colMap['gearbox'] = $colKey }
                                elseif ($headerText -match 'date|fecha') { $colMap['date'] = $colKey }
                                elseif ($headerText -match 'video|link|yt|youtube') { $colMap['video'] = $colKey }
                            }
                            continue
                        }
                        continue
                    }

                    $driverCol = $colMap['driver']
                    $timeCol = $colMap['time']
                    $driver = if ($rowCells.ContainsKey($driverCol)) { "$($rowCells[$driverCol])".Trim() } else { '' }
                    $timeStr = if ($rowCells.ContainsKey($timeCol)) { "$($rowCells[$timeCol])".Trim() } else { '' }

                    if ([string]::IsNullOrWhiteSpace($driver) -or [string]::IsNullOrWhiteSpace($timeStr) -or $timeStr -eq '--' -or $timeStr -eq '-') {
                        continue
                    }

                    $timeMs = Parse-TimeToMs $timeStr
                    if ($null -eq $timeMs) { continue }

                    $deviceCol = $colMap['device']
                    $carCol = $colMap['car']
                    $gearboxCol = $colMap['gearbox']
                    $dateCol = $colMap['date']
                    $videoCol = $colMap['video']

                    $device = if ($rowCells.ContainsKey($deviceCol) -and -not [string]::IsNullOrWhiteSpace($rowCells[$deviceCol])) { "$($rowCells[$deviceCol])".Trim() } else { 'PC' }
                    $car = if ($rowCells.ContainsKey($carCol) -and -not [string]::IsNullOrWhiteSpace($rowCells[$carCol])) { "$($rowCells[$carCol])".Trim() } else { 'BMW M3 GTR' }
                    $gearbox = if ($rowCells.ContainsKey($gearboxCol) -and -not [string]::IsNullOrWhiteSpace($rowCells[$gearboxCol])) { "$($rowCells[$gearboxCol])".Trim() } else { 'Manual' }
                    
                    # Formateo de fecha de Excel si es número de serie (ej: 44257.0)
                    $rawDate = if ($rowCells.ContainsKey($dateCol)) { "$($rowCells[$dateCol])".Trim() } else { '' }
                    $formattedDate = $rawDate
                    if ($rawDate -match '^\d{5}(?:\.\d+)?$') {
                        try {
                            $oaVal = [double]$rawDate
                            $formattedDate = [DateTime]::FromOADate($oaVal).ToString('dd/MM/yyyy')
                        } catch {}
                    }

                    # Resolución de URL de video (YouTube / Twitch / Bilibili)
                    $videoRef = "$videoCol$rowNum"
                    $driverRef = "$driverCol$rowNum"
                    $yt = ''

                    if ($linkMap.ContainsKey($videoRef)) {
                        $yt = $linkMap[$videoRef]
                    } elseif ($linkMap.ContainsKey($driverRef)) {
                        $yt = $linkMap[$driverRef]
                    } elseif ($rowCells.ContainsKey($videoCol)) {
                        $cellVideoText = "$($rowCells[$videoCol])".Trim()
                        if ($cellVideoText -match '^https?://') {
                            $yt = $cellVideoText
                        }
                    }

                    # Fallback de video: buscar si otra celda de la fila contiene el hipervínculo
                    if ([string]::IsNullOrWhiteSpace($yt)) {
                        foreach ($cRef in $linkMap.Keys) {
                            if ($cRef -match "^[A-Z]+$rowNum$") {
                                $target = $linkMap[$cRef]
                                if ($target -match 'youtu|bilibili|twitch') {
                                    $yt = $target
                                    break
                                }
                            }
                        }
                    }

                    if ([string]::IsNullOrWhiteSpace($yt)) {
                        $yt = '#'
                    }

                    $records += [PSCustomObject]@{
                        rank = ('#' + ($records.Count + 1))
                        driver = $driver
                        time = $timeStr
                        timeMs = $timeMs
                        car = $car
                        device = $device
                        gearbox = $gearbox
                        date = $formattedDate
                        yt = $yt
                        verified = $true
                    }
                }

                if ($records.Count -gt 0) {
                    $sorted = $records | Sort-Object { $_.timeMs }
                    for ($idx = 0; $idx -lt $sorted.Count; $idx++) {
                        $sorted[$idx].rank = ('#' + ($idx + 1))
                    }
                    return $sorted
                }
            }
        }
    }
    catch {
        # Fallback a CSV si falla la descarga o procesamiento XLSX
    }

    # 2. Fallback de respaldo vía CSV
    try {
        $csvText = curl.exe -L -s $sheetUrl
        $lines = $csvText -split "`r?`n" | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
        if ($lines.Count -lt 2) { return @() }

        # Buscar fila de cabecera
        $headerIdx = -1
        for ($k = 0; $k -lt [Math]::Min(5, $lines.Count); $k++) {
            $testLine = $lines[$k].ToLower()
            if ($testLine -match 'driver|player|piloto' -and $testLine -match 'time|tiempo') {
                $headerIdx = $k
                break
            }
        }

        if ($headerIdx -lt 0) { $headerIdx = 0 }
        $headerCols = $lines[$headerIdx] -split ',' | ForEach-Object { $_.Trim(' "').ToLower() }
        
        $colIdxDriver = 1
        $colIdxTime = 2
        $colIdxDevice = 3
        $colIdxCar = 4
        $colIdxGearbox = 5
        $colIdxDate = 6
        $colIdxVideo = 7

        for ($c = 0; $c -lt $headerCols.Count; $c++) {
            $hc = $headerCols[$c]
            if ($hc -match 'driver|player|piloto') { $colIdxDriver = $c }
            elseif ($hc -match '^time|^tiempo') { $colIdxTime = $c }
            elseif ($hc -match 'device|dispositivo|mando|input') { $colIdxDevice = $c }
            elseif ($hc -match 'car|vehic|auto|coche') { $colIdxCar = $c }
            elseif ($hc -match 'gear|caja|trans') { $colIdxGearbox = $c }
            elseif ($hc -match 'date|fecha') { $colIdxDate = $c }
            elseif ($hc -match 'video|link|yt|youtube') { $colIdxVideo = $c }
        }

        $records = @()
        for ($i = $headerIdx + 1; $i -lt $lines.Count; $i++) {
            $line = $lines[$i]
            $cols = [System.Text.RegularExpressions.Regex]::Split($line, ',(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)') | ForEach-Object { $_.Trim(' "') }
            if ($cols.Count -le [Math]::Max($colIdxDriver, $colIdxTime)) { continue }

            $driver = $cols[$colIdxDriver]
            $timeStr = $cols[$colIdxTime]
            if ([string]::IsNullOrWhiteSpace($driver) -or [string]::IsNullOrWhiteSpace($timeStr) -or $timeStr -eq '--' -or $timeStr -eq '-') {
                continue
            }

            $timeMs = Parse-TimeToMs $timeStr
            if ($null -eq $timeMs) { continue }

            $device = if ($cols.Count -gt $colIdxDevice -and -not [string]::IsNullOrWhiteSpace($cols[$colIdxDevice])) { $cols[$colIdxDevice] } else { 'PC' }
            $car = if ($cols.Count -gt $colIdxCar -and -not [string]::IsNullOrWhiteSpace($cols[$colIdxCar])) { $cols[$colIdxCar] } else { 'BMW M3 GTR' }
            $gearbox = if ($cols.Count -gt $colIdxGearbox -and -not [string]::IsNullOrWhiteSpace($cols[$colIdxGearbox])) { $cols[$colIdxGearbox] } else { 'Manual' }
            $date = if ($cols.Count -gt $colIdxDate) { $cols[$colIdxDate] } else { '' }
            $yt = if ($cols.Count -gt $colIdxVideo -and $cols[$colIdxVideo] -match '^https?://') { $cols[$colIdxVideo] } else { '#' }

            $records += [PSCustomObject]@{
                rank = ('#' + ($records.Count + 1))
                driver = $driver
                time = $timeStr
                timeMs = $timeMs
                car = $car
                device = $device
                gearbox = $gearbox
                date = $date
                yt = $yt
                verified = $true
            }
        }

        $sorted = $records | Sort-Object { $_.timeMs }
        for ($idx = 0; $idx -lt $sorted.Count; $idx++) {
            $sorted[$idx].rank = ('#' + ($idx + 1))
        }

        return $sorted
    }
    catch {
        Write-Warning ('Error procesando CSV fallback: ' + $_.Exception.Message)
        return @()
    }
}

Write-Host '==========================================================' -ForegroundColor Cyan
Write-Host ' NFSRANKSMW: Migracion Masiva Corregida a Firebase RTDB' -ForegroundColor Yellow
Write-Host ' (Extraccion OpenXML de Hipervinculos Reales + Tiempos Corregidos)' -ForegroundColor Gray
Write-Host (' Endpoint base: ' + $FirebaseBaseUrl) -ForegroundColor Gray
Write-Host '==========================================================' -ForegroundColor Cyan

$routesDataPath = Join-Path $PSScriptRoot '..\assets\js\routes-data.js'
if (-not (Test-Path $routesDataPath)) {
    Write-Error ('No se encontro routes-data.js en ' + $routesDataPath)
    exit 1
}

$rawContent = Get-Content $routesDataPath -Raw -Encoding UTF8
$pattern = '(?ms)\{\s*name:\s*"([^"]+)",\s*type:\s*"([^"]+)",\s*sheets:\s*\{(.*?)\}\s*\}'
$matches = [regex]::Matches($rawContent, $pattern)

Write-Host ('Se detectaron ' + $matches.Count + ' pistas en routes-data.js.') -ForegroundColor Green

$routeIndex = 0
$totalRecordsMigrated = 0

foreach ($m in $matches) {
    $routeIndex++
    $routeName = $m.Groups[1].Value
    $routeType = $m.Groups[2].Value
    $sheetsBlock = $m.Groups[3].Value
    $routeKey = Sanitize-Key $routeName

    Write-Host ('[' + $routeIndex + '/' + $matches.Count + '] ' + $routeName + ' (' + $routeType + ')...') -ForegroundColor White

    if ($routeType -eq 'Circuito') {
        $categories = @('junkmanSingle', 'junkmanFast', 'bmwSingle', 'bmwFast')
        $catKeys = @{
            'junkmanSingle' = 'junkman_single'
            'junkmanFast' = 'junkman_fast'
            'bmwSingle' = 'bmw_single'
            'bmwFast' = 'bmw_fast'
        }

        foreach ($cat in $categories) {
            $catKey = $catKeys[$cat]
            $catRegex = $cat + '\s*:\s*"([^"]+)"'
            if ($sheetsBlock -match $catRegex) {
                $sheetUrl = $Matches[1]
                $records = Process-SheetUrl $sheetUrl
                if ($records.Count -gt 0) {
                    $jsonPayload = $records | ConvertTo-Json -Depth 5 -Compress
                    $targetUrl = $FirebaseBaseUrl + '/leaderboards/' + $routeKey + '/' + $catKey + '.json'
                    try {
                        $putRes = Invoke-RestMethod -Uri $targetUrl -Method Put -Body $jsonPayload -ContentType 'application/json; charset=utf-8'
                        $totalRecordsMigrated += $records.Count
                        Write-Host ('   -> ' + $catKey + ': ' + $records.Count + ' records.') -ForegroundColor Green
                    }
                    catch {
                        Write-Warning ('   Error guardando en Firebase: ' + $_.Exception.Message)
                    }
                }
            }
        }
    }
    else {
        $categories = @('junkman', 'bmw')
        foreach ($cat in $categories) {
            $catRegex = $cat + '\s*:\s*"([^"]+)"'
            if ($sheetsBlock -match $catRegex) {
                $sheetUrl = $Matches[1]
                $records = Process-SheetUrl $sheetUrl
                if ($records.Count -gt 0) {
                    $jsonPayload = $records | ConvertTo-Json -Depth 5 -Compress
                    $targetUrl = $FirebaseBaseUrl + '/leaderboards/' + $routeKey + '/' + $cat + '.json'
                    try {
                        $putRes = Invoke-RestMethod -Uri $targetUrl -Method Put -Body $jsonPayload -ContentType 'application/json; charset=utf-8'
                        $totalRecordsMigrated += $records.Count
                        Write-Host ('   -> ' + $cat + ': ' + $records.Count + ' records.') -ForegroundColor Green
                    }
                    catch {
                        Write-Warning ('   Error guardando en Firebase: ' + $_.Exception.Message)
                    }
                }
            }
        }
    }
    Start-Sleep -Milliseconds 40
}

Write-Host '==========================================================' -ForegroundColor Cyan
Write-Host (' ¡MIGRACION COMPLETADA CON EXITO! Total records: ' + $totalRecordsMigrated) -ForegroundColor Green
Write-Host '==========================================================' -ForegroundColor Cyan
