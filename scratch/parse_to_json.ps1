# Parse all matches from both Challonge SVGs
function Parse-ChallongeSvg {
    param([string]$FilePath, [string]$TournamentKey)
    $svg = Get-Content -Raw -Encoding UTF8 $FilePath
    
    # Title
    $title = ""
    if ($svg -match '<text[^>]*class="tournament-name[^"]*"[^>]*>(.*?)<\/text>') {
        $title = $matches[1]
    } elseif ($svg -match '<text[^>]*x="25"[^>]*y="35"[^>]*>(.*?)<\/text>') {
        $title = $matches[1]
    }
    
    $matchElements = [regex]::Matches($svg, '<g[^>]*class="match\s+[^"]*"[^>]*data-identifier="([^"]+)"[^>]*data-match-id="([^"]+)"[^>]*>([\s\S]*?)<\/g>\s*<\/g>')
    if ($matchElements.Count -eq 0) {
        $matchElements = [regex]::Matches($svg, '<g[^>]*class="match\s+[^"]*"[^>]*data-identifier="([^"]+)"[^>]*data-match-id="([^"]+)"[^>]*>([\s\S]*?)<\/svg>\s*<\/g>')
    }

    $allMatches = @()
    
    # Also find all participants
    $partMap = @{}

    # Regex for match
    $mRegex = [regex]'<g[^>]*class="match[^"]*"[^>]*data-identifier="([^"]+)"[^>]*data-match-id="([^"]+)"[\s\S]*?<g clip-path="url\(#match-clippath-[^)]+\)">([\s\S]*?)<\/g>\s*<\/g>'
    $allMatchTags = $mRegex.Matches($svg)

    foreach ($m in $allMatchTags) {
        $ident = $m.Groups[1].Value
        $matchId = $m.Groups[2].Value
        $content = $m.Groups[3].Value
        
        $playerMatches = [regex]::Matches($content, '<svg[^>]*class="match--player"[^>]*data-participant-id="([^"]+)"[^>]*>[\s\S]*?<title>(.*?)<\/title>[\s\S]*?<text[^>]*class="match--seed"[^>]*>(.*?)<\/text>[\s\S]*?<text[^>]*class="match--player-name\s*([^"]*)"[^>]*>(.*?)<\/text>[\s\S]*?<text[^>]*class="match--player-score\s*([^"]*)"[^>]*>(.*?)<\/text>')
        
        $p1 = $null
        $p2 = $null
        
        if ($playerMatches.Count -ge 1) {
            $pm1 = $playerMatches[0]
            $p1 = @{
                id = $pm1.Groups[1].Value
                name = $pm1.Groups[2].Value
                seed = $pm1.Groups[3].Value
                isWinner = ($pm1.Groups[4].Value -match '-winner' -or $pm1.Groups[6].Value -match '-winner')
                score = $pm1.Groups[7].Value
            }
            $partMap[$p1.id] = @{ name = $p1.name; seed = $p1.seed }
        }
        if ($playerMatches.Count -ge 2) {
            $pm2 = $playerMatches[1]
            $p2 = @{
                id = $pm2.Groups[1].Value
                name = $pm2.Groups[2].Value
                seed = $pm2.Groups[3].Value
                isWinner = ($pm2.Groups[4].Value -match '-winner' -or $pm2.Groups[6].Value -match '-winner')
                score = $pm2.Groups[7].Value
            }
            $partMap[$p2.id] = @{ name = $p2.name; seed = $p2.seed }
        }

        $allMatches += @{
            identifier = [int]$ident
            matchId = $matchId
            player1 = $p1
            player2 = $p2
        }
    }

    return @{
        key = $TournamentKey
        title = $title
        participants = $partMap.Values | Sort-Object { [int]$_.seed }
        matches = $allMatches | Sort-Object { $_.identifier }
    }
}

$t1 = Parse-ChallongeSvg -FilePath "scratch/test.svg" -TournamentKey "6as1doj5"
$t2 = Parse-ChallongeSvg -FilePath "scratch/ev1n0yug.svg" -TournamentKey "ev1n0yug"

$result = @($t1, $t2)
$result | ConvertTo-Json -Depth 6 | Out-File -Encoding utf8 "scratch/tournaments_data.json"
Write-Host "Tournaments parsed successfully!"
Write-Host "T1 Participants: $($t1.participants.Count), Matches: $($t1.matches.Count)"
Write-Host "T2 Participants: $($t2.participants.Count), Matches: $($t2.matches.Count)"
