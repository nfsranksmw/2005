Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$sheetId = '1akdM1Au09TRjUyi14WhelZU6RKqfzEiNOum3cASBxOQ'
$xlsxUrl = "https://docs.google.com/spreadsheets/d/$sheetId/export?format=xlsx"

Write-Host "Downloading XLSX from $xlsxUrl..."
$wc = New-Object System.Net.WebClient
$wc.Headers.Add('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)')
$bytes = $wc.DownloadData($xlsxUrl)
Write-Host "Downloaded $($bytes.Length) bytes!"

$memStream = New-Object System.IO.MemoryStream(, $bytes)
$zip = New-Object System.IO.Compression.ZipArchive($memStream, [System.IO.Compression.ZipArchiveMode]::Read)

Write-Host "`nEntries in ZIP:"
foreach ($e in $zip.Entries) {
    Write-Host ("  " + $e.FullName)
}

# Read workbook.xml to see sheet names and ids
$wbEntry = $zip.GetEntry('xl/workbook.xml')
if ($wbEntry) {
    $reader = New-Object System.IO.StreamReader($wbEntry.Open(), [System.Text.Encoding]::UTF8)
    [xml]$wbXml = $reader.ReadToEnd()
    $reader.Close()
    Write-Host "`nSheets in workbook:"
    foreach ($sh in $wbXml.workbook.sheets.sheet) {
        Write-Host ("  Sheet: name='" + $sh.name + "', sheetId=" + $sh.sheetId + ", r:id=" + $sh.id)
    }
}

# Read shared strings
$sstEntry = $zip.GetEntry('xl/sharedStrings.xml')
$sst = @()
if ($sstEntry) {
    $reader = New-Object System.IO.StreamReader($sstEntry.Open(), [System.Text.Encoding]::UTF8)
    [xml]$ssXml = $reader.ReadToEnd()
    $reader.Close()
    foreach ($si in $ssXml.sst.si) {
        $sst += $si.InnerText
    }
    Write-Host "`nTotal shared strings: $($sst.Count)"
}

$zip.Dispose()
$memStream.Dispose()
