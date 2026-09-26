$ErrorActionPreference = 'Stop'

$edgePath = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

# Create a self-contained runner page
$runnerHtml = @"
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>JS Runtime Test</title></head>
<body>
    <div id="output">START</div>
    <div id="view-home" class="view-section active"></div>
    <div id="view-routes" class="view-section"></div>
    <div id="view-submit" class="view-section"></div>
    <div id="discord-floating-container"></div>
    <button id="discord-floating-btn"></button>

    <script src="../assets/js/routes-data.js"></script>
    <script src="../assets/js/blacklist-data.js"></script>
    <script src="../assets/js/tournaments-data.js"></script>
    <script src="../assets/js/members-data.js"></script>
    <script src="../assets/js/tuning-data.js"></script>
    <script src="../assets/js/i18n.js"></script>
    <script src="../assets/js/operator-icons.js"></script>
    <script src="../assets/js/firebase-config.js"></script>
    <script src="../assets/js/app.js"></script>

    <script>
        var log = [];
        try {
            log.push("switchView type: " + typeof switchView);
            switchView('routes');
            log.push("routes active: " + document.getElementById('view-routes').classList.contains('active'));
            switchView('submit');
            log.push("submit active: " + document.getElementById('view-submit').classList.contains('active'));
            switchView('home');
            log.push("home active: " + document.getElementById('view-home').classList.contains('active'));

            log.push("toggleDiscordFloatingDrawer type: " + typeof toggleDiscordFloatingDrawer);
            toggleDiscordFloatingDrawer();
            log.push("discord open: " + document.getElementById('discord-floating-container').classList.contains('open'));
            toggleDiscordFloatingDrawer();
            log.push("discord closed: " + !document.getElementById('discord-floating-container').classList.contains('open'));

            log.push("ALL_TESTS_PASSED");
        } catch(e) {
            log.push("ERROR: " + e.message + " stack: " + e.stack);
        }
        document.getElementById('output').innerText = log.join(" | ");
        document.title = log.join(" | ");
    </script>
</body>
</html>
"@

Set-Content -Path 'scratch/runner.html' -Value $runnerHtml -Encoding utf8
$runnerUri = 'file:///' + (Resolve-Path 'scratch/runner.html').Path.Replace('\', '/')

# Run Edge headless and capture the DOM
$res = & $edgePath --headless --disable-gpu --dump-dom $runnerUri 2>&1
$resStr = $res -join "`n"

$match = [regex]::Match($resStr, '<div id="output">(.*?)</div>')
if ($match.Success) {
    Write-Host "Result from browser DOM:"
    Write-Host $match.Groups[1].Value
} else {
    Write-Host "Could not find output div, raw output length: $($resStr.Length)"
    Write-Host $resStr.Substring(0, [Math]::Min(500, $resStr.Length))
}
