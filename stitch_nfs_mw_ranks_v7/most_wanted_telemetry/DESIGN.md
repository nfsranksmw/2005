---
name: Most Wanted Telemetry
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363941'
  surface-container-lowest: '#0b0e15'
  surface-container-low: '#191c23'
  surface-container: '#1d2027'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e0e2ec'
  on-surface-variant: '#d5c4ab'
  inverse-surface: '#e0e2ec'
  inverse-on-surface: '#2d3038'
  outline: '#9e8f78'
  outline-variant: '#514532'
  surface-tint: '#ffba20'
  primary: '#ffdca1'
  on-primary: '#412d00'
  primary-container: '#ffb800'
  on-primary-container: '#6b4c00'
  inverse-primary: '#7c5800'
  secondary: '#ffb59c'
  on-secondary: '#5c1900'
  secondary-container: '#ff5708'
  on-secondary-container: '#511500'
  tertiary: '#6ef3ff'
  on-tertiary: '#00363a'
  tertiary-container: '#00d9e7'
  on-tertiary-container: '#005a60'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdea8'
  primary-fixed-dim: '#ffba20'
  on-primary-fixed: '#271900'
  on-primary-fixed-variant: '#5e4200'
  secondary-fixed: '#ffdbcf'
  secondary-fixed-dim: '#ffb59c'
  on-secondary-fixed: '#390c00'
  on-secondary-fixed-variant: '#822700'
  tertiary-fixed: '#7df4ff'
  tertiary-fixed-dim: '#00dbe9'
  on-tertiary-fixed: '#002022'
  on-tertiary-fixed-variant: '#004f54'
  background: '#10131a'
  on-background: '#e0e2ec'
  surface-variant: '#32353c'
typography:
  headline-xl:
    fontFamily: Chivo
    fontSize: 48px
    fontWeight: '900'
    lineHeight: 52px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Chivo
    fontSize: 32px
    fontWeight: '900'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Chivo
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Chivo
    fontSize: 26px
    fontWeight: '800'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Chivo
    fontSize: 24px
    fontWeight: '800'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Chivo
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
    letterSpacing: 0em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-timer-lg:
    fontFamily: JetBrains Mono
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.04em
  label-timer-md:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.02em
  label-data:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-hud:
    fontFamily: Chivo
    fontSize: 11px
    fontWeight: '900'
    lineHeight: 14px
    letterSpacing: 0.14em
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 2rem
  margin-lg: 3.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
The design system reflects the raw, high-stakes kinetic energy of underground circuit racing combined with modern, precision-engineered speedrun esports analytics. It channels the visceral spirit of Rockport's asphalt, industrial shipyard grime, and late-autumn speedways through high-contrast digital instrumentation. 

Targeting an audience of competitive record-setters, route strategists, and modding speedrunners, the interface must project relentless momentum, clinical millisecond accuracy, and tactical urgency.

The design movement bridges **High-Contrast Digital HUD / Industrial Brutalism** with sleek esports tournament polish:
- **Atmosphere:** Deep carbon surfaces, grit-tinted asphalt backgrounds, laser-focused micro-borders, and high-frequency luminescent alerts.
- **Accents:** High-heat tachometer ambers, scorching nitrous oranges, and cold pursuit cyans evoke police heat levels, radar radar pings, and peak RPM zones.
- **Tactility:** Angular chamfers, telemetry data stamps, razor-sharp HUD framing, and crisp geometric data overlays replace conventional rounded mobile-app patterns.

## Colors
The color architecture relies on a pitch-black and deep asphalt substrate illuminated by high-output automotive racing indicators.

### Key Roles
- **Primary (`#FFB800` - Apex Amber):** Tachometer redline threshold, #1 leaderboard badges, primary interactive triggers, active tab states, and world record indicators.
- **Secondary (`#FF5500` - Nitrous Flare):** High pursuit heat indicators, sector deltas behind record pace, critical warnings, and destructive action states.
- **Tertiary (`#00F0FF` - Heat Radar Cyan):** Police heat levels, radar traps, telemetry split data, verified speedrun markers, and auxiliary technical readouts.
- **Neutral (`#12151C` - Carbon Chassis):** The structural core. Surfaces step up sequentially from `#0B0D11` (canvas foundation) to `#12151C` (structural modules) and `#181C26` (elevated split rows and telemetry containers).

### Functional States
- **Track Surface Subtle:** `#232938` for sub-borders, dividers, and dormant component outlines.
- **On-Dark Typography:** `#F3F4F6` (Pure Spec Sheet White) for primary titles and times; `#94A3B8` (Brake Rotor Grey) for secondary telemetry, metadata labels, and vehicle class descriptions.
- **Success / Under-Pace:** `#10B981` (Green Sector Split).

## Typography
Typographic identity relies on high-velocity contrasts: aggressive, forward-leaning italicized display titles paired with surgical, tabular-spaced timecode matrices.

- **Headlines (Chivo):** Set predominantly in bold/black weights with slight uppercase tracking for categories (`RACE ROUTES`, `BLACKLIST ELITE`), or dense negative kerning for track names. When used for category banners, an 8-degree forward slant (simulated or italicized) conveys physical acceleration.
- **Body & Data Prose (Hanken Grotesk):** Provides hyper-legible, unpretentious reading comfort for driver bios, rule clarifications, and run submissions across dark backgrounds.
- **Instrumentation & Lap Times (JetBrains Mono):** Demanded for millisecond precision (`02:14.392`), top speeds (`384.2 KM/H`), sector deltas (`-00:00.128`), and vehicle performance stats. All numeric data columns must enforce tabular figures (`font-variant-numeric: tabular-nums`).

## Layout & Spacing
The layout follows an esports cockpit logic: dense, tabular, modular, and screen-efficient to maximize visible leaderboard entries and track map telemetry without excessive scrolling.

### Grid Structure
- **Desktop (1200px+):** 12-column dynamic grid with `gutter-lg` (1.5rem) and `margin-lg` (3.5rem). The central telemetry/leaderboard matrix consumes 8 or 9 columns, flanked by a 3 or 4-column route map, pursuit conditions, and blacklist milestone tracker.
- **Tablet (768px - 1199px):** 8-column layout with `gutter` (1rem) and `margin-md` (2rem). Side rails stack below or fold into segmented drawer panels.
- **Mobile (< 768px):** 4-column compact layout with `gutter` (1rem) and `margin` (1rem). Leaderboard rows collapse non-essential split sectors, retaining rank, pilot callsign, platform icon, and total lap time.

### Spacing Rhythm
Vertical rhythm adheres to an industrial 4px/8px micro-grid. Spacers (`space-xs` through `space-sm`) govern dense telemetry tags and leaderboard sub-metrics, while structural section divides utilize `space-xl` to maintain distinct cockpit compartments.

## Elevation & Depth
Depth does not rely on soft, generic dropshadows. Instead, elevation is expressed through **stacked surface luminescence, razor-edge borders, and optical HUD halos**.

### Surface Hierarchy
1. **Basement / Canvas (`#0B0D11`):** The structural asphalt core, occasionally textured with a subtle diagonal scanline or carbon grid pattern at 2% opacity.
2. **Track Container / Module (`#12151C`):** Base cards, leaderboard tables, and telemetry wrappers. Framed by a 1px solid stroke in `#232938`.
3. **Elevated Sector / Hover Surface (`#181C26`):** Active rank rows, hovered table items, and interactive modal dialogs.
4. **Apex Overlay (`#232938`):** Tooltips, vehicle spec dropdown overlays, and flight-recorder popups.

### Border Glows & Lighting
- **Rank #1 / Blacklist Glow:** A crisp 1px border in `#FFB800` paired with an ambient perimeter aura: `box-shadow: 0 0 16px rgba(255, 184, 0, 0.22), inset 0 0 8px rgba(255, 184, 0, 0.08)`.
- **Pursuit Hazard Glow:** A 1px border in `#00F0FF` with an electrostatic cyan glow: `box-shadow: 0 0 14px rgba(0, 240, 255, 0.28)`.
- **Resting Focus:** Flat 1px border `#232938` brightening to `#94A3B8` on interactive focus.

## Shapes
The shape language is strictly **Sharp & Angular (`0`)**, referencing cut metal chassis, telemetry gauge bezels, and the razor-sharp styling of street-modified supercars.

- **Chamfered Cuts:** High-importance visual anchors (Leaderboard Rank tags, Blacklist milestone cards, primary CTAs) utilize a geometric 45-degree corner cut (`clip-path: polygon(...)`) on top-right and bottom-left vertices (typically 6px to 8px chamfer).
- **Zero Radius:** Standard elements—input fields, split table rows, tooltips, vehicle thumbnail frames—strictly enforce `border-radius: 0px`. Soft, round curves are avoided to prevent dilution of the aggressive motorsport aesthetic.
- **Accented Notches:** Segmented tabs and panel headers incorporate 2px vertical slash indicators or diagonal decorative ticks to reinforce HUD diagnostics.

## Components

### Buttons
- **Primary (Nitro Ignite):** Background `#FFB800`, text `#0B0D11` in uppercase `Chivo` Bold. Dual chamfered opposite corners (6px cut). Hover triggers an immediate shift to `#FFA000` with an outer amber flare `0 0 20px rgba(255, 184, 0, 0.45)`.
- **Secondary (Pursuit Outline):** Transparent background, 1px solid `#00F0FF`, text `#00F0FF` in `JetBrains Mono`. Hover triggers background fill `rgba(0, 240, 255, 0.12)`.
- **Ghost / Utility:** Background `#181C26`, 1px border `#232938`, text `#94A3B8`. Hover brightens text to `#FFFFFF` and border to `#94A3B8`.

### Leaderboard Rows & Tables
- **Header:** Sticky `#0B0D11` surface with 1px border bottom `#232938`. All labels styled in `label-hud` (`Chivo` uppercase 11px, tracked out).
- **Standard Row:** Alternating subtle background (`#12151C` / `#141822`). 1px bottom border `#1C2230`. Hover produces an instant transition to `#181C26` with a 2px left border accent in `#FFB800`.
- **Top 3 Ranks:** 
  - Rank 1: Deep black surface flanked by an intense `#FFB800` left border gauge, gold-tinted pilot callsign, and an integrated "#1 BLACKLIST" micro-badge.
  - Rank 2 & 3: Highlighted with subtle warm silver and bronze left edge pinstripes.

### Telemetry Badges & Chips
- **Heat Level Indicator:** Pill-less, sharp rectangular block. Background `rgba(255, 85, 0, 0.15)`, border `1px solid #FF5500`, text `#FF5500` in `JetBrains Mono` bold.
- **Platform & Controller Tag:** Monospaced micro-badge (`10px`), neutral dark background `#181C26`, border `#232938`, text `#94A3B8`.

### Input Fields & Search
- Solid `#0E1117` background with a 1px border in `#232938`. Inner padding `space-sm` vertical, `space-md` horizontal.
- Monospaced typography for speedrun filter search and car category selectors.
- Active/Focus state snaps border immediately to `#FFB800` with a subtle inside glow, dropping all default browser focus rings.

### Checkboxes & Segmented Selectors
- Checkboxes are strict 14x14px squares with a 1px `#232938` border. Checked state fills `#FFB800` with an industrial black tick.
- Filter toggle bars use connected rectangular segments with 1px borders. Active segment features an amber top border (2px) and `#181C26` background.

### Domain-Specific Components
- **Split Lap Timer Matrix:** Tabular monospaced time readout featuring green/red comparison tags (`-00:00.412` or `+00:01.084`) positioned beside split checkpoints.
- **Route Mini-Map HUD Card:** Dark container displaying route elevation, surface type breakdown (asphalt, gravel, industrial boardwalk), police spawn risk level, and nitrous refill zones framed with cyan corner tick marks.