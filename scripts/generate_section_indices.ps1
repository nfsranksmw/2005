# ==============================================================================
# GENERADOR AUTOMÁTICO DE ÍNDICES POR SECCIÓN (Multi-Page / Clean URL Routing)
# Crea carpetas físicas con su propio index.html para soporte total en
# servidores estáticos (GitHub Pages, Cloudflare Pages, Apache, Nginx, Spaceship)
# ==============================================================================

$rootHtmlPath = (Resolve-Path "index.html").Path
$htmlContent = Get-Content $rootHtmlPath -Raw -Encoding utf8

$sections = @(
    @{ Folder = "leaderboard";            View = "leaderboard";             Title = "Leaderboard Oficial" },
    @{ Folder = "leaderboards";           View = "leaderboard";             Title = "Leaderboards Oficiales" },
    @{ Folder = "challenges";             View = "challenges";              Title = "Desafíos Semanales & Temporadas Blacklist" },
    @{ Folder = "desafio";                View = "challenges";              Title = "Desafíos Semanales Oficiales" },
    @{ Folder = "desafios";               View = "challenges";              Title = "Desafíos Semanales Oficiales" },
    @{ Folder = "routes";                 View = "routes";                  Title = "Índice de 86 Rutas Oficiales" },
    @{ Folder = "blacklist";              View = "blacklist";               Title = "Blacklist Event 2026 // Rockport City" },
    @{ Folder = "championship-standings"; View = "championship-standings";  Title = "Clasificación General del Campeonato" },
    @{ Folder = "standings";              View = "championship-standings";  Title = "Clasificación General del Campeonato" },
    @{ Folder = "blacklist-cards";        View = "blacklist-cards";         Title = "Fichas Técnicas & Liveries Blacklist" },
    @{ Folder = "cards";                  View = "blacklist-cards";         Title = "Fichas Técnicas Blacklist" },
    @{ Folder = "championship-register";  View = "championship-register";   Title = "Inscripción Oficial al Campeonato" },
    @{ Folder = "register";               View = "championship-register";   Title = "Inscripción al Campeonato" },
    @{ Folder = "past-tournaments";       View = "past-tournaments";        Title = "Torneos Anteriores & Archivo Histórico" },
    @{ Folder = "halloffame";             View = "halloffame";              Title = "Salón de la Fama Oficial" },
    @{ Folder = "globaldrivers";          View = "globaldrivers";           Title = "Top Corredores Globales" },
    @{ Folder = "globalroutes";           View = "globalroutes";            Title = "Estadísticas Globales de Rutas" },
    @{ Folder = "guides";                 View = "guides";                  Title = "Guías de Rendimiento & Tuning" },
    @{ Folder = "rules";                  View = "rules";                   Title = "Reglamento & Normativa Oficial" },
    @{ Folder = "tutorial";               View = "tutorial";                Title = "Tutorial Oficial del Torneo" },
    @{ Folder = "driverprofile";          View = "driverprofile";           Title = "Expediente de Piloto" },
    @{ Folder = "submit";                 View = "submit";                  Title = "Registro Oficial de Tiempo & Video" },
    @{ Folder = "download";               View = "download";                Title = "Descargas & Utilidades Oficiales" },
    @{ Folder = "map";                    View = "map";                     Title = "Mapa de Rockport City en Vivo" },
    @{ Folder = "members";                View = "members";                 Title = "Comunidad Oficial de Discord & Miembros" }
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
