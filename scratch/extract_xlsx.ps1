Add-Type -AssemblyName System.IO.Compression.FileSystem

$zipPath = (Resolve-Path 'scratch/test.xlsx').Path
$dir = Join-Path (Resolve-Path 'scratch').Path 'test_xlsx_extracted'

if (Test-Path $dir) { 
    Remove-Item -Recurse -Force $dir 
}

[System.IO.Compression.ZipFile]::ExtractToDirectory($zipPath, $dir)

Write-Host "Files in extracted XLSX:"
Get-ChildItem -Recurse $dir | ForEach-Object { $_.FullName }

$relsFile = Join-Path $dir 'xl/worksheets/_rels/sheet1.xml.rels'
if (Test-Path $relsFile) {
    Write-Host "`n=== RELS FILE FOUND ==="
    Get-Content $relsFile -Encoding UTF8
} else {
    Write-Host "No sheet1.xml.rels found."
}

$sheetFile = Join-Path $dir 'xl/worksheets/sheet1.xml'
if (Test-Path $sheetFile) {
    Write-Host "`n=== SHEET1.XML HYPERLINKS SEARCH ==="
    $sheetXml = Get-Content $sheetFile -Raw -Encoding UTF8
    if ($sheetXml -match '<hyperlinks>[\s\S]*?</hyperlinks>') {
        Write-Host $Matches[0]
    } else {
        Write-Host "No <hyperlinks> block found in sheet1.xml"
    }
}
