$filePath = "assets\js\i18n.js"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

$emojis = @("🏆", "⚡", "⚔️", "⚔", "💀", "📝", "🏛️", "🏛", "⚙️", "⚙", "📋", "🔍", "🚀", "📥", "🗺️", "🗺", "👥", "🎮", "🚦")

$navKeys = @(
    "nav_challenges_menu",
    "nav_challenges_weekly",
    "nav_blacklist_roster",
    "nav_championship",
    "nav_blacklist_cards",
    "nav_championship_register",
    "nav_past_tournaments",
    "nav_guides",
    "nav_rules",
    "nav_search_driver",
    "nav_submit_time",
    "nav_dropdown_download",
    "nav_dropdown_map",
    "nav_members",
    "nav_dropdown_members",
    "nav_map",
    "filter_circuits",
    "filter_sprints",
    "filter_drags"
)

$lines = $content -split "`n"
$count = 0

for ($i = 0; $i -lt $lines.Length; $i++) {
    $line = $lines[$i]
    foreach ($key in $navKeys) {
        if ($line -match "^(\s*$key:\s*`")([^`"]*)(`".*)$") {
            $prefix = $Matches[1]
            $val = $Matches[2]
            $suffix = $Matches[3]
            $oldVal = $val
            
            foreach ($em in $emojis) {
                if ($val.StartsWith($em)) {
                    $val = $val.Substring($em.Length).TrimStart()
                }
            }
            if ($oldVal -ne $val) {
                $count++
                $lines[$i] = "$prefix$val$suffix"
            }
        }
    }
}

[System.IO.File]::WriteAllText($filePath, ($lines -join "`n"), [System.Text.Encoding]::UTF8)
Write-Output "Cleaned $count emoji occurrences from i18n.js"
