$dir = 'scratch/test_xlsx_extracted'

$sharedStringsFile = Join-Path $dir 'xl/sharedStrings.xml'
$sst = @()
if (Test-Path $sharedStringsFile) {
    [xml]$ssXml = Get-Content $sharedStringsFile -Encoding UTF8
    foreach ($si in $ssXml.sst.si) {
        $sst += $si.t
    }
}
Write-Host "Total shared strings: $($sst.Count)"
for ($i = 0; $i -lt [Math]::Min(15, $sst.Count); $i++) {
    Write-Host ("sst[$i] = " + $sst[$i])
}

$sheetFile = Join-Path $dir 'xl/worksheets/sheet1.xml'
[xml]$sXml = Get-Content $sheetFile -Encoding UTF8

# Build hyperlink map: ref -> target
$relsFile = Join-Path $dir 'xl/worksheets/_rels/sheet1.xml.rels'
$linkMap = @{}
if (Test-Path $relsFile) {
    [xml]$rXml = Get-Content $relsFile -Encoding UTF8
    $relTargetMap = @{}
    foreach ($rel in $rXml.Relationships.Relationship) {
        $relTargetMap[$rel.Id] = $rel.Target
    }
    if ($sXml.worksheet.hyperlinks) {
        foreach ($hl in $sXml.worksheet.hyperlinks.hyperlink) {
            $rId = $hl.id
            if (-not $rId) { $rId = $hl.GetAttribute('r:id') }
            if ($relTargetMap.ContainsKey($rId)) {
                $linkMap[$hl.ref] = $relTargetMap[$rId]
            }
        }
    }
}

Write-Host "`nHyperlink map:"
foreach ($k in $linkMap.Keys) {
    Write-Host ("  $k -> " + $linkMap[$k])
}

Write-Host "`nRows from sheet1.xml:"
foreach ($row in $sXml.worksheet.sheetData.row) {
    $rowNum = $row.r
    $cells = @{}
    foreach ($c in $row.c) {
        $ref = $c.r
        $colLetter = [regex]::Match($ref, '^[A-Z]+').Value
        $val = ""
        if ($c.t -eq 's') {
            $idx = [int]$c.v
            $val = $sst[$idx]
        } elseif ($c.v) {
            $val = $c.v
        }
        $cells[$colLetter] = $val
    }
    Write-Host ("Row " + $rowNum + ": A=" + $cells['A'] + ", B=" + $cells['B'] + ", C=" + $cells['C'] + ", D=" + $cells['D'] + ", E=" + $cells['E'] + ", F=" + $cells['F'] + ", G=" + $cells['G'] + ", H=" + $cells['H'])
}
