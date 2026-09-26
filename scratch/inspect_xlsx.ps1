$xlsxPath = "scratch/test.xlsx"
$extractPath = "scratch/test_xlsx_extracted"
if (Test-Path $extractPath) { Remove-Item -Recurse -Force $extractPath }

[System.IO.Compression.ZipFile]::ExtractToDirectory((Resolve-Path $xlsxPath), (Resolve-Path "scratch") + "\test_xlsx_extracted")

Write-Host "XLSX extracted successfully!"
Get-ChildItem -Recurse $extractPath | Select-Object FullName

# Check sheet1.xml
$sheetXmlPath = "$extractPath/xl/worksheets/sheet1.xml"
if (Test-Path $sheetXmlPath) {
    Write-Host "`nFound sheet1.xml! Content preview:"
    $xml = [System.IO.File]::ReadAllText($sheetXmlPath, [System.Text.Encoding]::UTF8)
    Write-Host ($xml.Substring(0, [Math]::Min(1000, $xml.Length)))
}

# Check relationships (hyperlinks!)
$relsPath = "$extractPath/xl/worksheets/_rels/sheet1.xml.rels"
if (Test-Path $relsPath) {
    Write-Host "`nFound sheet1.xml.rels! Content preview:"
    $relsXml = [System.IO.File]::ReadAllText($relsPath, [System.Text.Encoding]::UTF8)
    Write-Host $relsXml
}
