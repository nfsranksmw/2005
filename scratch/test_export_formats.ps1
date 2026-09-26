$urlBase = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYMNQXaAzlB0eoNiiWX5RekaYWGZWXGgYbWsPSj57AhOjmkh9zGXetaIROVrYoys1Djg4j7aCkFyup/pub"

$formats = @('xlsx', 'ods', 'pdf', 'csv', 'tsv', 'html')
foreach ($fmt in $formats) {
    $u = "$urlBase?gid=634347005&single=true&output=$fmt"
    try {
        $headers = curl.exe -s -I -L $u
        $firstLine = ($headers -split "`r?`n")[0]
        $contentDisp = ($headers -split "`r?`n") | Where-Object { $_ -match 'content-disposition|content-type' }
        Write-Host "Format: $fmt -> $firstLine | $($contentDisp -join ' | ')"
    } catch {
        Write-Host "Format $fmt error: $_"
    }
}
