function Parse-TimeToMs([string]$timeStr) {
    if ([string]::IsNullOrWhiteSpace($timeStr)) { return $null }
    $clean = $timeStr.Trim()
    if ($clean -eq '--' -or $clean -eq '-' -or $clean -eq 'N/A' -or $clean -eq 'none') { return $null }

    # Format: "0m 24s 010ms" or "19s 810ms"
    if ($clean -match '(?i)(?:(\d+)m)?\s*(\d+)s\s*(\d+)?') {
        $m = if ($Matches[1]) { [int]$Matches[1] } else { 0 }
        $s = if ($Matches[2]) { [int]$Matches[2] } else { 0 }
        $msRaw = if ($Matches[3]) { $Matches[3] } else { '0' }
        if ($msRaw.Length -eq 1) { $msRaw += '00' }
        elseif ($msRaw.Length -eq 2) { $msRaw += '0' }
        elseif ($msRaw.Length -gt 3) { $msRaw = $msRaw.Substring(0, 3) }
        return ($m * 60000) + ($s * 1000) + [int]$msRaw
    }

    # Format: "M.SS.xx" (two dots, e.g. 4.56.26 or 4.59.04)
    if ($clean -match '^(\d+)\.(\d{1,2})\.(\d+)$') {
        $mins = [int]$Matches[1]
        $secs = [int]$Matches[2]
        $msRaw = $Matches[3]
        if ($msRaw.Length -eq 1) { $msRaw += '00' }
        elseif ($msRaw.Length -eq 2) { $msRaw += '0' }
        elseif ($msRaw.Length -gt 3) { $msRaw = $msRaw.Substring(0, 3) }
        return ($mins * 60000) + ($secs * 1000) + [int]$msRaw
    }

    # Format: "SS:xx:00" or "SS:xx:xx" where SS < 60 (e.g. 35:42:00 in short circuits)
    if ($clean -match '^(\d{1,2}):(\d{1,2}):(\d{2})$') {
        $p1 = [int]$Matches[1]
        $p2 = [int]$Matches[2]
        $p3 = [int]$Matches[3]
        # If p3 is 00 and p1 < 60, it's seconds : hundredths : 00
        if ($p3 -eq 0 -and $p1 -lt 60) {
            $msRaw = $Matches[2]
            if ($msRaw.Length -eq 1) { $msRaw += '00' }
            elseif ($msRaw.Length -eq 2) { $msRaw += '0' }
            return ($p1 * 1000) + [int]$msRaw
        }
        # Otherwise standard H:MM:SS
        return ($p1 * 3600000) + ($p2 * 60000) + ($p3 * 1000)
    }

    # Format: "M:SS.xxx" or "MM:SS.xxx" or "M:SS"
    if ($clean.Contains(':')) {
        $parts = $clean.Split(':')
        $mins = [int]$parts[0]
        $secParts = $parts[1].Split('.')
        $secs = [int]$secParts[0]
        $msStr = if ($secParts.Length -gt 1) { $secParts[1] } else { '0' }
        if ($msStr.Length -eq 1) { $msStr += '00' }
        elseif ($msStr.Length -eq 2) { $msStr += '0' }
        elseif ($msStr.Length -gt 3) { $msStr = $msStr.Substring(0, 3) }
        $ms = [int]$msStr
        return ($mins * 60000) + ($secs * 1000) + $ms
    }

    # Format: "SS.xxx" (seconds and milliseconds)
    if ($clean.Contains('.')) {
        $secParts = $clean.Split('.')
        $secs = [int]$secParts[0]
        $msStr = if ($secParts.Length -gt 1) { $secParts[1] } else { '0' }
        if ($msStr.Length -eq 1) { $msStr += '00' }
        elseif ($msStr.Length -eq 2) { $msStr += '0' }
        elseif ($msStr.Length -gt 3) { $msStr = $msStr.Substring(0, 3) }
        $ms = [int]$msStr
        return ($secs * 1000) + $ms
    }

    # Plain seconds integer
    if ($clean -match '^\d+$') {
        return [int]$clean * 1000
    }

    return $null
}

# Test suite
$tests = @(
    @{ input = '4.56.26'; expected = 296260 },
    @{ input = '4:53.36'; expected = 293360 },
    @{ input = '4.59.04'; expected = 299040 },
    @{ input = '1:20.750'; expected = 80750 },
    @{ input = '37.23'; expected = 37230 },
    @{ input = '35:42:00'; expected = 35420 },
    @{ input = '19s 810ms'; expected = 19810 },
    @{ input = '0m 24s 010ms'; expected = 24010 }
)

$passed = 0
foreach ($t in $tests) {
    $res = Parse-TimeToMs $t.input
    $ok = $res -eq $t.expected
    $statusStr = if ($ok) { "OK" } else { "FAIL" }
    Write-Host ("Test: " + $t.input + " -> " + $res + " (expected " + $t.expected + ") -> " + $statusStr)
}
Write-Host "`nTotal Passed: $passed / $($tests.Count)"
