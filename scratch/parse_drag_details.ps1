$dir = 'C:\Users\willi\.gemini\antigravity\scratch\nfs-mw-records\scratch\drag_sheet_extracted'

# Load shared strings
[xml]$ssXml = Get-Content (Join-Path $dir 'xl/sharedStrings.xml') -Encoding UTF8
$sharedStrings = @()
foreach ($si in $ssXml.sst.si) {
    $t = if ($si.t) { $si.t } else { ($si.r | ForEach-Object { $_.t }) -join '' }
    $sharedStrings += $t
}

function Parse-Sheet-Compact($sheetNum, $sheetName) {
    Write-Host "`n=========================================="
    Write-Host "PARSING SHEET ${sheetNum}: $sheetName"
    Write-Host "=========================================="

    $relsFile = Join-Path $dir "xl/worksheets/_rels/sheet${sheetNum}.xml.rels"
    $hyperlinksMap = @{}
    if (Test-Path $relsFile) {
        [xml]$relsXml = Get-Content $relsFile -Encoding UTF8
        foreach ($rel in $relsXml.Relationships.Relationship) {
            $hyperlinksMap[$rel.Id] = $rel.Target
        }
    }

    $sheetFile = Join-Path $dir "xl/worksheets/sheet${sheetNum}.xml"
    [xml]$sheetXml = Get-Content $sheetFile -Encoding UTF8

    $cellHyperlinks = @{}
    if ($sheetXml.worksheet.hyperlinks) {
        foreach ($hl in $sheetXml.worksheet.hyperlinks.hyperlink) {
            $ref = $hl.ref
            $rId = $hl.id
            $target = $hyperlinksMap[$rId]
            $cellHyperlinks[$ref] = $target
        }
    }

    foreach ($row in $sheetXml.worksheet.sheetData.row) {
        $rowNum = $row.r
        $hasData = $false
        $rowCells = @()
        foreach ($c in $row.c) {
            $cellRef = $c.r
            $val = ""
            if ($c.t -eq "s") {
                $idx = [int]$c.v
                $val = $sharedStrings[$idx]
            } elseif ($c.v) {
                $val = $c.v
            }
            $hl = if ($cellHyperlinks.ContainsKey($cellRef)) { $cellHyperlinks[$cellRef] } else { "" }
            if ($val -or $hl) { $hasData = $true }
            $hlText = if ($hl) { " (HL: $hl)" } else { "" }
            $rowCells += "$cellRef=[$val]$hlText"
        }
        if ($hasData) {
            Write-Host "Row $rowNum : $($rowCells -join ' | ')"
        }
    }
}

Parse-Sheet-Compact 1 "Junkman Nos"
Parse-Sheet-Compact 2 "BMW No Nos"
