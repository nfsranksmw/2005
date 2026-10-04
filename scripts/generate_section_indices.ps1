# ==============================================================================
# GENERADOR AUTOMÁTICO DE ÍNDICES POR SECCIÓN (Multi-Page / Clean URL Routing)
# Crea carpetas físicas con su propio index.html para soporte total en
# servidores estáticos (GitHub Pages, Cloudflare Pages, Apache, Nginx, Spaceship)
# ==============================================================================

$rootHtmlPath = (Resolve-Path "index.html").Path
$htmlContent = Get-Content $rootHtmlPath -Raw -Encoding utf8

$sections = @(
    @{ Folder = "leaderboard";            View = "leaderboard";             Title = "Official Leaderboard" },
    @{ Folder = "leaderboards";           View = "leaderboard";             Title = "Official Leaderboards" },
    @{ Folder = "challenges";             View = "challenges";              Title = "Weekly Challenges & Blacklist Seasons" },
    @{ Folder = "desafio";                View = "challenges";              Title = "Official Weekly Challenges" },
    @{ Folder = "desafios";               View = "challenges";              Title = "Official Weekly Challenges" },
    @{ Folder = "routes";                 View = "routes-pistas";           Title = "Route to Track // 86 Official Routes Index" },
    @{ Folder = "routes-pistas";          View = "routes-pistas";           Title = "Explorador de Rutas y Circuitos // Telemetry Hub" },
    @{ Folder = "pistas";                 View = "routes-pistas";           Title = "Explorador de Rutas y Circuitos // Telemetry Hub" },
    @{ Folder = "blacklist";              View = "blacklist";               Title = "Blacklist Event 2026 // Rockport City" },
    @{ Folder = "championship-standings"; View = "championship-standings";  Title = "Championship General Standings" },
    @{ Folder = "standings";              View = "championship-standings";  Title = "Championship General Standings" },
    @{ Folder = "blacklist-cards";        View = "blacklist-cards";         Title = "Blacklist Tactical Dossiers & Liveries" },
    @{ Folder = "cards";                  View = "blacklist-cards";         Title = "Blacklist Tactical Dossiers" },
    @{ Folder = "championship-register";  View = "championship-register";   Title = "Official Championship Registration" },
    @{ Folder = "register";               View = "championship-register";   Title = "Championship Registration" },
    @{ Folder = "past-tournaments";       View = "past-tournaments";        Title = "Past Tournaments & Historical Archive" },
    @{ Folder = "halloffame";             View = "halloffame";              Title = "Official Hall of Fame" },
    @{ Folder = "globaldrivers";          View = "globaldrivers";           Title = "Top Global Drivers" },
    @{ Folder = "globalroutes";           View = "globalroutes";            Title = "Global Route Records & Statistics" },
    @{ Folder = "guides";                 View = "guides";                  Title = "Performance & Tuning Guides" },
    @{ Folder = "rules";                  View = "rules";                   Title = "Official Rules & Regulations" },
    @{ Folder = "tutorial";               View = "tutorial";                Title = "Official Tournament Tutorial" },
    @{ Folder = "driverprofile";          View = "driverprofile";           Title = "Driver Telemetry Dossier" },
    @{ Folder = "submit";                 View = "submit";                  Title = "Official Time & Video Registration" },
    @{ Folder = "download";               View = "download";                Title = "Official Game Download & Utilities" },
    @{ Folder = "map";                    View = "map";                     Title = "Rockport City Live Virtual GPS Map" },
    @{ Folder = "members";                View = "members";                 Title = "Official Discord Community & Member Roster" }
)

$utf8NoBom = New-Object System.Text.UTF8Encoding $false

foreach ($sec in $sections) {
    $folderName = $sec.Folder
    $viewId = $sec.View
    $sectionTitle = $sec.Title

    $targetDir = Join-Path (Resolve-Path ".").Path $folderName
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir | Out-Null
    }

    $mod = $htmlContent

    # 1. Rutas relativas a assets subiendo 1 nivel (../assets/)
    $mod = $mod -replace 'href="assets/', 'href="../assets/'
    $mod = $mod -replace 'src="assets/', 'src="../assets/'
    $mod = $mod -replace 'href="admin.html"', 'href="../admin.html"'
    $mod = $mod -replace 'href="sitemap.xml"', 'href="../sitemap.xml"'

    # 2. Canonical URL actualizada a la subsección
    $mod = $mod -replace '<link rel="canonical" href="https://nfsmwranks.online/">', "<link rel=""canonical"" href=""https://nfsmwranks.online/$folderName/"">"

    # 3. Título SEO de la subsección
    $mod = $mod -replace '<title>NFSMWRanks \|[^<]*</title>', "<title>NFSMWRanks | $sectionTitle - Need for Speed: Most Wanted (2005)</title>"

    # 4. Activar la sección correspondiente por defecto
    $mod = $mod -replace 'id="view-home" class="view-section active"', 'id="view-home" class="view-section"'
    $mod = $mod -replace "id=""view-$viewId"" class=""view-section""", "id=""view-$viewId"" class=""view-section active"""

    # 5. Ocultar el banner flotante de Discord si no es la home
    if ($viewId -ne 'home') {
        $mod = $mod -replace 'id="discord-floating-container"', 'id="discord-floating-container" style="display: none;"'
    }

    $targetFile = Join-Path $targetDir "index.html"
    [System.IO.File]::WriteAllBytes($targetFile, $utf8NoBom.GetBytes($mod))

    Write-Host "[OK] Generado $folderName/index.html (Sección: $viewId)"
}

Write-Host "`nTodas las secciones cuentan con su propio index.html independiente."
