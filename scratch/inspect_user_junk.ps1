Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$sheetId = '1akdM1Au09TRjUyi14WhelZU6RKqfzEiNOum3cASBxOQ'
$xlsxUrl = "https://docs.google.com/spreadsheets/d/$sheetId/export?format=xlsx"

$wc = New-Object System.Net.WebClient
$wc.Headers.Add('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)')
$bytes = $wc.DownloadData($xlsxUrl)

$memStream = New-Object System.IO.MemoryStream(, $bytes)
$zip = New-Object System.IO.Compression.ZipArchive($memStream, [System.IO.Compression.ZipArchiveMode]::Read)

# 1. Read shared strings
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

# 2. Read sheet1 rels for hyperlinks
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

# 3. Read sheet1.xml
$sheetEntry = $zip.GetEntry('xl/worksheets/sheet1.xml')
$linkMap = @{}
if ($sheetEntry) {
    $reader = New-Object System.IO.StreamReader($sheetEntry.Open(), [System.Text.Encoding]::UTF8)
    [xml]$sXml = $reader.ReadToEnd()
    $reader.Close()

    if ($sXml.worksheet.hyperlinks) {
        foreach ($hl in $sXml.worksheet.hyperlinks.hyperlink) {
            $rId = $hl.id
            if (-not $rId) { $rId = $hl.GetAttribute('r:id') }
            if ($relTargetMap.ContainsKey($rId)) {
                $linkMap[$hl.ref] = $relTargetMap[$rId]
            }
        }
    }

    Write-Host "Mapped $($linkMap.Count) hyperlinks in sheet1.xml (Junk Nos)."
    foreach ($k in $linkMap.Keys) {
        Write-Host ("  " + $k + " -> " + $linkMap[$k])
    }

    Write-Host "`nRows in sheet1.xml:"
    foreach ($row in $sXml.worksheet.sheetData.row) {
        $rNum = $row.r
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
        $line = ($rowCells.Keys | Sort-Object | ForEach-Object { "$_=$($rowCells[$_])" }) -join ' | '
        Write-Host ("Row " + $rNum + ": " + $line)
    }
}

$zip.Dispose()
$memStream.Dispose()
