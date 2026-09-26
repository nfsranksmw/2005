$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
    $edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

$testScript = @"
(() => {
    const results = [];
    
    // Check submit elements
    const startMark = document.getElementById('sub-start-mark');
    const endMark = document.getElementById('sub-end-mark');
    const compPanel = document.getElementById('telemetry-comparison-panel');
    const timeDeclared = document.getElementById('sub-time');
    
    results.push('startMark absent: ' + (startMark === null));
    results.push('endMark absent: ' + (endMark === null));
    results.push('compPanel absent: ' + (compPanel === null));
    results.push('timeDeclared present: ' + (timeDeclared !== null));
    
    if (timeDeclared) {
        timeDeclared.value = '01:23.456';
        if (typeof window.validateTimeMarksLive === 'function') {
            window.validateTimeMarksLive();
            results.push('validateTimeMarksLive executed without error');
            results.push('has success class: ' + timeDeclared.classList.contains('field-success'));
        }
    }
    
    // Check label text
    const label = document.querySelector('label[for="sub-time"]');
    if (label) {
        results.push('label text: ' + label.innerText.trim());
    }
    
    console.log('TEST_RESULTS_START');
    console.log(JSON.stringify(results));
    console.log('TEST_RESULTS_END');
})();
"@

$htmlFile = (Resolve-Path "submit/index.html").Path
$fileUrl = "file:///$($htmlFile.Replace('\', '/'))"

Write-Host "Running Edge headless test on: $fileUrl"

# Inject script into a temporary test html or evaluate via DOM
$tempFile = [System.IO.Path]::GetTempFileName() + ".html"
$content = Get-Content $htmlFile -Raw -Encoding utf8
$injected = $content.Replace("</body>", "<script>$testScript</script></body>")
Set-Content -Path $tempFile -Value $injected -Encoding utf8

$proc = Start-Process -FilePath $edgePath -ArgumentList @(
    "--headless",
    "--disable-gpu",
    "--dump-dom",
    "file:///$($tempFile.Replace('\', '/'))"
) -NoNewWindow -PassThru -RedirectStandardOutput "$tempFile.out.txt"

$proc.WaitForExit(10000)

$out = Get-Content "$tempFile.out.txt" -Raw
Remove-Item $tempFile -Force -ErrorAction SilentlyContinue
Remove-Item "$tempFile.out.txt" -Force -ErrorAction SilentlyContinue

Write-Host "Edge Execution Complete. Checking DOM elements..."
if ($out -match 'id="sub-start-mark"') {
    Write-Host "FAIL: sub-start-mark found!" -ForegroundColor Red
} else {
    Write-Host "PASS: sub-start-mark removed!" -ForegroundColor Green
}

if ($out -match 'id="sub-end-mark"') {
    Write-Host "FAIL: sub-end-mark found!" -ForegroundColor Red
} else {
    Write-Host "PASS: sub-end-mark removed!" -ForegroundColor Green
}

if ($out -match 'id="telemetry-comparison-panel"') {
    Write-Host "FAIL: telemetry-comparison-panel found!" -ForegroundColor Red
} else {
    Write-Host "PASS: telemetry-comparison-panel removed!" -ForegroundColor Green
}

if ($out -match 'id="sub-time"') {
    Write-Host "PASS: sub-time is present!" -ForegroundColor Green
} else {
    Write-Host "FAIL: sub-time is missing!" -ForegroundColor Red
}

if ($out -match 'Tiempo declarado en pantalla') {
    Write-Host "PASS: Label 'Tiempo declarado en pantalla' found!" -ForegroundColor Green
} else {
    Write-Host "FAIL: Label 'Tiempo declarado en pantalla' not found!" -ForegroundColor Red
}
