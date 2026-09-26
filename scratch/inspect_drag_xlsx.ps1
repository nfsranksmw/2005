Add-Type -AssemblyName System.IO.Compression.FileSystem

$zipPath = (Resolve-Path 'scratch/drag_sheet.xlsx').Path
$dir = Join-Path (Resolve-Path 'scratch').Path 'drag_sheet_extracted'

if (Test-Path $dir) { 
    Remove-Item -Recurse -Force $dir 
}

[System.IO.Compression.ZipFile]::ExtractToDirectory($zipPath, $dir)

Write-Host "=== WORKBOOK.XML ==="
$wbFile = Join-Path $dir 'xl/workbook.xml'
if (Test-Path $wbFile) {
    [xml]$wb = Get-Content $wbFile -Encoding UTF8
    $wb.workbook.sheets.sheet | ForEach-Object {
        Write-Host "Sheet Name: $($_.name) | sheetId: $($_.sheetId) | r:id: $($_.id)"
    }
}

Write-Host "`n=== SHARED STRINGS ==="
$ssFile = Join-Path $dir 'xl/sharedStrings.xml'
if (Test-Path $ssFile) {
    [xml]$ss = Get-Content $ssFile -Encoding UTF8
    $i = 0
    foreach ($si in $ss.sst.si) {
        $text = if ($si.t) { $si.t } else { ($si.r | ForEach-Object { $_.t }) -join '' }
        Write-Host "[$i] $text"
        $i++
    }
}
