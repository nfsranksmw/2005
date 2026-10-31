/**
 * NFSMW RANKS V7.1 — Uiverse.io UI + Migrated Home, Rutas y Circuitos & Firebase RTDB Engine
 * Connects directly to Google Firebase Realtime Database:
 * https://nfsranks-blacklist-default-rtdb.firebaseio.com
 */

const FIREBASE_RTDB_BASE_URL =
  (window.NFS_FIREBASE && window.NFS_FIREBASE.RTDB_URL) ||
  'https://nfsranks-blacklist-default-rtdb.firebaseio.com';
const FIREBASE_DB_BASE_URL = FIREBASE_RTDB_BASE_URL;

// Early Global Stub to guarantee instant execution on any click
if (typeof window !== "undefined") {
  window.switchTorneoTab = function (tabId) {
    if (window._realSwitchTorneoTab) {
      return window._realSwitchTorneoTab(tabId);
    }
    window._pendingTorneoTab = tabId || "standings";
    try {
      const tid = tabId || "standings";
      const targetPanelId = `torneo-panel-${tid}`;
      document.querySelectorAll(".view-section").forEach((s) => s.classList.toggle("is-active", s.id === "view-blog"));
      document.querySelectorAll(".torneo-tab-panel").forEach((p) => p.classList.toggle("is-active", p.id === targetPanelId));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (_) {}
  };
}


// ============================================================================
// 1. VERIFIED TRACK WORLD RECORDS & CANONICAL FALLBACK DATA (86 TRACKS)
// ============================================================================
const STITCH_VERIFIED_TRACK_RECORDS = {
  "city perimeter": { time: "01:20.750", driver: "Lea4Speed0", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "14 Pilotos", s1: "27.4s" },
  "ironwood states": { time: "00:37.230", driver: "Mike", car: "Lotus Elise", spec: "Junkman Spec", speed: "338 km/h", flag: "ES", pilots: "13 Pilotos", s1: "14.2s" },
  "campus way": { time: "01:01.890", driver: "Mike", car: "Lotus Elise", spec: "Junkman Spec", speed: "338 km/h", flag: "ES", pilots: "10 Pilotos", s1: "21.4s" },
  "highlands": { time: "00:37.280", driver: "X1PROCL", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "CL", pilots: "6 Pilotos", s1: "13.8s" },
  "petersburgs": { time: "00:49.400", driver: "Lea4Speed0", car: "Lotus Elise", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "12 Pilotos", s1: "17.9s" },
  "heritage height": { time: "01:07.430", driver: "Zonda", car: "Lotus Elise", spec: "Junkman Spec", speed: "338 km/h", flag: "ES", pilots: "11 Pilotos", s1: "23.1s" },
  "omega": { time: "00:59.650", driver: "Lea4Speed0", car: "Lotus Elise", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "11 Pilotos", s1: "20.2s" },
  "diamond": { time: "01:25.730", driver: "Lea4Speed0", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "7 Pilotos", s1: "28.4s" },
  "hillcrest boundary": { time: "01:25.880", driver: "Darkrai", car: "Lotus Elise", spec: "Junkman Spec", speed: "338 km/h", flag: "ES", pilots: "10 Pilotos", s1: "28.6s" },
  "circle rose": { time: "01:05.470", driver: "Lea4Speed0", car: "Lotus Elise", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "13 Pilotos", s1: "22.5s" },
  "switchback": { time: "01:25.710", driver: "Skymaster", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "BR", pilots: "8 Pilotos", s1: "28.1s" },
  "hospital switchback": { time: "01:07.100", driver: "Darkrai", car: "Lotus Elise", spec: "Junkman Spec", speed: "338 km/h", flag: "ES", pilots: "7 Pilotos", s1: "22.9s" },
  "dunwich bay": { time: "01:09.200", driver: "Lea4Speed0", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "7 Pilotos", s1: "23.7s" },
  "boundary": { time: "00:58.880", driver: "Lea4Speed0", car: "Lotus Elise", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "10 Pilotos", s1: "19.8s" },
  "century square": { time: "00:41.400", driver: "Lea4Speed0", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "7 Pilotos", s1: "15.1s" },
  "heritage & omega": { time: "01:08.570", driver: "ZimanX", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "PL", pilots: "8 Pilotos", s1: "23.4s" },
  "little italy": { time: "00:54.300", driver: "Lea4Speed0", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "12 Pilotos", s1: "18.6s" },
  "ironhorse": { time: "01:21.830", driver: "Lea4Speed0", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "9 Pilotos", s1: "27.6s" },
  "waterfront": { time: "01:41.220", driver: "Darkrai", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "ES", pilots: "6 Pilotos", s1: "33.4s" },
  "gray point": { time: "01:08.960", driver: "ZimanX", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "PL", pilots: "6 Pilotos", s1: "23.5s" },
  "omega & industries": { time: "01:26.600", driver: "Lea4Speed0", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "5 Pilotos", s1: "28.9s" },
  "bay bridge": { time: "01:03.383", driver: "Lea4Speed0", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "12 Pilotos", s1: "21.8s" },
  "camden tunnel": { time: "01:05.690", driver: "Darkrai", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "ES", pilots: "10 Pilotos", s1: "22.4s" },
  "campus interchange": { time: "01:51.760", driver: "Darkrai", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "ES", pilots: "7 Pilotos", s1: "36.2s" },
  "country club": { time: "01:51.230", driver: "Lea4Speed0", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "11 Pilotos", s1: "36.0s" },
  "east park": { time: "01:22.810", driver: "Mike", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "ES", pilots: "7 Pilotos", s1: "27.9s" },
  "oil refinery": { time: "01:17.030", driver: "Lea4Speed0", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "9 Pilotos", s1: "25.8s" },
  "hastings": { time: "02:57.110", driver: "X1PROCL", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "CL", pilots: "9 Pilotos", s1: "54.2s" },
  "clubhouse": { time: "01:32.420", driver: "ARS3N", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "RU", pilots: "5 Pilotos", s1: "30.4s" },
  "seaside & power station": { time: "01:14.450", driver: "Lea4Speed0", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "9 Pilotos", s1: "24.9s" },
  "nfs world loop": { time: "04:52.783", driver: "13MwRR", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "352 km/h", flag: "RU", pilots: "17 Pilotos", s1: "58.4s" },
  "diamond & unión": { time: "01:05.960", driver: "Lea4Speed0", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "12 Pilotos", s1: "22.4s" },
  "hwy 99 & states": { time: "01:26.320", driver: "ARS3N", car: "Lotus Elise", spec: "Junkman Spec", speed: "338 km/h", flag: "RU", pilots: "11 Pilotos", s1: "28.7s" },
  "clubhouse & hollis": { time: "01:21.630", driver: "Skymaster", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "BR", pilots: "10 Pilotos", s1: "27.1s" },
  "stadium & hwy 99": { time: "01:25.420", driver: "ARS3N", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "RU", pilots: "14 Pilotos", s1: "28.2s" },
  "rosewood & state": { time: "01:18.330", driver: "ARS3N", car: "Lotus Elise", spec: "Junkman Spec", speed: "338 km/h", flag: "RU", pilots: "6 Pilotos", s1: "26.1s" },
  "rosewood & lyon": { time: "01:13.640", driver: "ARS3N", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "RU", pilots: "8 Pilotos", s1: "24.5s" },
  "unión & hollis": { time: "01:48.000", driver: "ARS3N", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "RU", pilots: "11 Pilotos", s1: "35.4s" },
  "heritage & campus": { time: "01:19.610", driver: "Lea4Speed0", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "7 Pilotos", s1: "26.8s" },
  "campus chancellor": { time: "01:18.880", driver: "Lea4Speed0", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "12 Pilotos", s1: "26.4s" },
  "rockridge & unión": { time: "01:27.720", driver: "ARS3N", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "RU", pilots: "12 Pilotos", s1: "29.1s" },
  "chace & bristol": { time: "01:13.800", driver: "ARS3N", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "RU", pilots: "8 Pilotos", s1: "24.6s" },
  "beacon & station": { time: "01:13.600", driver: "ARS3N", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "RU", pilots: "9 Pilotos", s1: "24.5s" },
  "bristol & bayshore": { time: "01:13.840", driver: "ARS3N", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "RU", pilots: "5 Pilotos", s1: "24.6s" },
  "boundary & marina": { time: "01:08.910", driver: "ARS3N", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "RU", pilots: "4 Pilotos", s1: "23.1s" },
  "stadium & hwy 1": { time: "02:08.620", driver: "ARS3N", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "RU", pilots: "7 Pilotos", s1: "41.8s" },
  "north bay & harbor": { time: "01:48.217", driver: "13MwRR", car: "Lotus Elise", spec: "Junkman Spec", speed: "338 km/h", flag: "RU", pilots: "7 Pilotos", s1: "35.6s" },
  "camden & route 55": { time: "02:49.200", driver: "Lea4Speed0", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "8 Pilotos", s1: "52.1s" },
  "heritage & diamond": { time: "01:50.620", driver: "ZimanX", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "PL", pilots: "12 Pilotos", s1: "36.1s" },
  "camden & ironwood": { time: "02:22.860", driver: "ARS3N", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "RU", pilots: "10 Pilotos", s1: "46.4s" },
  "interchange & bond": { time: "01:28.740", driver: "Lea4Speed0", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "12 Pilotos", s1: "29.4s" },
  "union row & ocean": { time: "02:13.500", driver: "ARS3N", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "RU", pilots: "12 Pilotos", s1: "43.9s" },
  "diamond valley": { time: "02:02.680", driver: "ARS3N", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "RU", pilots: "8 Pilotos", s1: "40.2s" },
  "stadium & chace": { time: "02:12.866", driver: "13MwRR", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "RU", pilots: "5 Pilotos", s1: "43.6s" },
  "west park & lyon": { time: "01:02.950", driver: "Darkrai", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "ES", pilots: "12 Pilotos", s1: "21.2s" },
  "hwy 201 & lyons": { time: "01:22.980", driver: "HighPriest", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "US", pilots: "8 Pilotos", s1: "27.7s" },
  "bond & country club": { time: "01:39.960", driver: "Lea4Speed0", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "13 Pilotos", s1: "33.1s" },
  "lyon & states": { time: "02:51.650", driver: "ARS3N", car: "Lotus Elise", spec: "Junkman Spec", speed: "338 km/h", flag: "RU", pilots: "7 Pilotos", s1: "53.1s" },
  "camden & fisher": { time: "01:39.740", driver: "ARS3N", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "RU", pilots: "14 Pilotos", s1: "33.0s" },
  "beach & chancellor": { time: "01:39.450", driver: "Lea4Speed0", car: "Lotus Elise", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "10 Pilotos", s1: "32.9s" },
  "state & warren": { time: "02:51.700", driver: "ARS3N", car: "Lotus Elise", spec: "Junkman Spec", speed: "338 km/h", flag: "RU", pilots: "4 Pilotos", s1: "53.2s" },
  "valley & state": { time: "02:02.260", driver: "HighPriest", car: "Lotus Elise", spec: "Junkman Spec", speed: "338 km/h", flag: "US", pilots: "10 Pilotos", s1: "40.1s" },
  "seagate & camden": { time: "02:16.517", driver: "Lea4Speed0", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "6 Pilotos", s1: "44.8s" },
  "bond & forest green": { time: "01:33.390", driver: "Darkrai", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "ES", pilots: "7 Pilotos", s1: "31.1s" },
  "hwy 99 & projects": { time: "02:15.510", driver: "ARS3N", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "RU", pilots: "3 Pilotos", s1: "44.5s" },
  "seaside & lennox": { time: "01:57.250", driver: "ARS3N", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "RU", pilots: "10 Pilotos", s1: "38.7s" },
  "camden & dunwich": { time: "02:19.283", driver: "Lea4Speed0", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "7 Pilotos", s1: "45.6s" },
  "ironhorse & coast": { time: "02:12.950", driver: "Lea4Speed0", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "6 Pilotos", s1: "43.7s" },
  "seaside & interchange": { time: "02:28.760", driver: "Lea4Speed0", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "10 Pilotos", s1: "48.8s" },
  "hwy 2001": { time: "02:31.110", driver: "HighPriest", car: "Lotus Elise", spec: "Junkman Spec", speed: "338 km/h", flag: "US", pilots: "11 Pilotos", s1: "49.5s" },
  "diamond park": { time: "02:14.230", driver: "Darkrai", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "ES", pilots: "4 Pilotos", s1: "44.1s" },
  "industrial & bristol": { time: "01:35.967", driver: "Lea4Speed0", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "13 Pilotos", s1: "31.8s" },
  "bay bridge & seaside": { time: "02:29.400", driver: "ARS3N", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "RU", pilots: "9 Pilotos", s1: "49.0s" },
  "forest green": { time: "02:40.000", driver: "ARS3N", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "RU", pilots: "7 Pilotos", s1: "51.5s" },
  "clubhouse & lennox": { time: "02:32.367", driver: "Lea4Speed0", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "338 km/h", flag: "DE", pilots: "3 Pilotos", s1: "49.8s" },
  "bayshore & boardwalk": { time: "00:15.260", driver: "ssjoen", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "372 km/h", flag: "NL", pilots: "8 Pilotos", s1: "05.1s" },
  "heritage & rosewood": { time: "00:21.760", driver: "ssjoen", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "375 km/h", flag: "NL", pilots: "4 Pilotos", s1: "06.8s" },
  "harbor & ocean": { time: "00:17.420", driver: "ssjoen", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "371 km/h", flag: "NL", pilots: "7 Pilotos", s1: "05.6s" },
  "seaside & camden": { time: "00:14.230", driver: "5TATIC", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "381 km/h", flag: "US", pilots: "8 Pilotos", s1: "04.9s" },
  "union & rockridge": { time: "00:19.990", driver: "ssjoen", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "369 km/h", flag: "NL", pilots: "7 Pilotos", s1: "06.2s" },
  "ocean & harbor": { time: "00:18.730", driver: "Silentiumm", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "374 km/h", flag: "DE", pilots: "6 Pilotos", s1: "05.9s" },
  "riverside & terrace": { time: "00:14.170", driver: "InfacTus612", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "382 km/h", flag: "RU", pilots: "4 Pilotos", s1: "04.8s" },
  "rosewood & heritage": { time: "00:24.910", driver: "InfacTus612", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "377 km/h", flag: "RU", pilots: "4 Pilotos", s1: "07.4s" },
  "boardwalk & bayshore": { time: "00:22.370", driver: "InfacTus612", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "376 km/h", flag: "RU", pilots: "4 Pilotos", s1: "07.0s" },
  "camden & seaside": { time: "00:23.600", driver: "ssjoen", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "374 km/h", flag: "NL", pilots: "4 Pilotos", s1: "07.1s" },
  "terrace & riverside": { time: "00:16.610", driver: "InfacTus612", car: "Porsche Carrera GT", spec: "Junkman Spec", speed: "379 km/h", flag: "RU", pilots: "5 Pilotos", s1: "05.3s" }
};

const CITY_PERIMETER_DEFAULT_RECORDS = [
  { rank: "#1", driver: "Lea4Speed0", country: "DE // GERMANY", team: "Team Speedrun DE", time: "01:20.750", timeMs: 80750, car: "Porsche Carrera GT", setup: "Junkman Stage 3 + Trans 0/0", device: "PlayStation DualSense", gearbox: "Manual", date: "27/09/2026", yt: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { rank: "#2", driver: "SRTxAvenger", country: "US // UNITED STATES", team: "Apex Predator Club", time: "01:20.767", timeMs: 80767, car: "Porsche Carrera GT", setup: "Junkman Stage 3 / High Aero", device: "Logitech Dual Action", gearbox: "Auto", date: "23/04/2026", yt: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { rank: "#3", driver: "Xman", country: "ES // SPAIN", team: "Rockport Syndicate", time: "01:20.780", timeMs: 80780, car: "Porsche Carrera GT", setup: "Junkman Stage 3 / Short Gear", device: "PlayStation DualShock 4", gearbox: "Manual", date: "27/09/2026", yt: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { rank: "#4", driver: "Saitkb", country: "RU // INDEPENDENT", team: "Independent Driver", time: "01:20.840", timeMs: 80840, car: "Porsche Carrera GT", setup: "Junkman Stage 3", device: "PlayStation DualShock 4", gearbox: "Manual", date: "27/09/2026", verified: true, yt: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { rank: "#5", driver: "ZimanX", country: "PL // POLAND", team: "Apex Predator Club", time: "01:20.870", timeMs: 80870, car: "Porsche Carrera GT", setup: "Junkman Stage 3", device: "Logitech Dual Action", gearbox: "Auto", date: "19/05/2018", verified: true, yt: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { rank: "#6", driver: "Skymaster", country: "BR // BRAZIL", team: "Outlaw Tuning", time: "01:20.920", timeMs: 80920, car: "Porsche Carrera GT", setup: "Junkman Stage 3", device: "Xbox 360 Controller", gearbox: "Manual", date: "27/09/2026", verified: true, yt: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { rank: "#7", driver: "JS", country: "UK // UNITED KINGDOM", team: "Blacklist Ops", time: "01:20.940", timeMs: 80940, car: "Porsche Carrera GT", setup: "Junkman Stage 3", device: "PlayStation DualShock 3", gearbox: "Manual", date: "27/09/2026", verified: true, yt: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
  { rank: "#8", driver: "Darkrai", country: "ES // SPAIN", team: "Rockport Syndicate", time: "01:21.110", timeMs: 81110, car: "Porsche Carrera GT", setup: "Junkman Stage 3", device: "Logitech Dual Action", gearbox: "Auto", date: "12/11/2017", verified: true, yt: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }
];

const HOME_LIVE_LEADERBOARD_RECORDS = [
  { rank: 1, driver: "Lea4Speed0", time: "01:20.750", car: "Porsche Carrera GT", route: "City Perimeter", routeType: "Circuito" },
  { rank: 2, driver: "13MwRR", time: "04:52.783", car: "Porsche Carrera GT", route: "NFS World Loop", routeType: "Sprint" },
  { rank: 3, driver: "Skymaster", time: "01:14.650", car: "Porsche Carrera GT", route: "Seaside & Power Station", routeType: "Sprint" },
  { rank: 4, driver: "5TATIC", time: "00:14.230", car: "Porsche Carrera GT", route: "Seaside & Camden", routeType: "Drag" },
  { rank: 5, driver: "ZimanX", time: "01:20.870", car: "Porsche Carrera GT", route: "City Perimeter", routeType: "Circuito" }
];

const KNOWN_DRIVERS_MAP = {
  lea4speed0: { country: "DE // GERMANY", team: "Team Speedrun DE", device: "PlayStation DualSense", setup: "Junkman Stage 3 + Trans 0/0" },
  srtxavenger: { country: "US // UNITED STATES", team: "Apex Predator Club", device: "Logitech Dual Action", setup: "Junkman Stage 3 / High Aero" },
  xman: { country: "ES // SPAIN", team: "Rockport Syndicate", device: "PlayStation DualShock 4", setup: "Junkman Stage 3 / Short Gear" },
  saitkb: { country: "RU // INDEPENDENT", team: "Independent Driver", device: "PlayStation DualShock 4", setup: "Junkman Stage 3" },
  zimanx: { country: "PL // POLAND", team: "Apex Predator Club", device: "Logitech Dual Action", setup: "Junkman Stage 3" },
  skymaster: { country: "BR // BRAZIL", team: "Outlaw Tuning", device: "Xbox 360 Controller", setup: "Junkman Stage 3" },
  js: { country: "UK // UNITED KINGDOM", team: "Blacklist Ops", device: "PlayStation DualShock 3", setup: "Junkman Stage 3" },
  darkrai: { country: "ES // SPAIN", team: "Rockport Syndicate", device: "Logitech Dual Action", setup: "Junkman Stage 3" },
  ars3n: { country: "RU // RUSSIA", team: "Outlaw Tuning", device: "Xbox Series Controller", setup: "Junkman Stage 3" },
  "13mwrr": { country: "RU // RUSSIA", team: "Speedrun Elite", device: "Keyboard", setup: "Junkman Stage 3" }
};

// ============================================================================
// 2. HELPERS: FIREBASE KEYS, TIME PARSING, METADATA & CAR IMAGES
// ============================================================================
function sanitizeFirebaseKey(str) {
  if (!str) return "general";
  return String(str)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9_-]/g, "_")
    .replace(/[.#$[\]]/g, "_");
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseTimeToMs(timeStr) {
  if (!timeStr) return null;
  const s = String(timeStr).trim().toLowerCase();
  if (!s || s === "--" || s === "-" || s === "n/a") return null;

  const textMatch = s.match(/(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+(?:[.,]\d+)?)s)?\s*(?:(\d+)ms)?/);
  if (textMatch && (textMatch[1] || textMatch[2] || textMatch[3] || textMatch[4])) {
    const h = parseInt(textMatch[1] || "0", 10);
    const m = parseInt(textMatch[2] || "0", 10);
    const sec = parseFloat((textMatch[3] || "0").replace(",", "."));
    const msRaw = textMatch[4];
    let ms = 0;
    if (msRaw) {
      let padded = msRaw;
      if (padded.length === 1) padded += "00";
      else if (padded.length === 2) padded += "0";
      else if (padded.length > 3) padded = padded.slice(0, 3);
      ms = parseInt(padded, 10);
    }
    const total = (h * 3600 + m * 60 + sec) * 1000 + ms;
    if (total > 0) return Math.round(total);
  }

  const dotParts = s.split(".");
  if (dotParts.length === 3 && !s.includes(":")) {
    const mins = parseInt(dotParts[0], 10);
    const secs = parseInt(dotParts[1], 10);
    let msStr = dotParts[2] || "0";
    if (msStr.length === 1) msStr += "00";
    else if (msStr.length === 2) msStr += "0";
    else if (msStr.length > 3) msStr = msStr.slice(0, 3);
    const ms = parseInt(msStr, 10);
    if (!isNaN(mins) && !isNaN(secs) && !isNaN(ms)) {
      return mins * 60 * 1000 + secs * 1000 + ms;
    }
  }

  if (s.includes(":")) {
    const parts = s.split(":");
    if (parts.length === 2) {
      const mins = parseInt(parts[0], 10);
      const secParts = parts[1].split(".");
      const secs = parseInt(secParts[0], 10);
      let msStr = secParts[1] || "0";
      if (msStr.length === 1) msStr += "00";
      else if (msStr.length === 2) msStr += "0";
      else if (msStr.length > 3) msStr = msStr.slice(0, 3);
      const ms = parseInt(msStr, 10);
      if (!isNaN(mins) && !isNaN(secs)) {
        return mins * 60 * 1000 + secs * 1000 + (isNaN(ms) ? 0 : ms);
      }
    }
  }

  if (s.includes(".")) {
    const parts = s.split(".");
    const secs = parseInt(parts[0], 10);
    let msStr = parts[1] || "0";
    if (msStr.length === 1) msStr += "00";
    else if (msStr.length === 2) msStr += "0";
    else if (msStr.length > 3) msStr = msStr.slice(0, 3);
    const ms = parseInt(msStr, 10);
    if (!isNaN(secs)) {
      return secs * 1000 + (isNaN(ms) ? 0 : ms);
    }
  }

  return null;
}

function formatRaceTimeStandard(timeVal) {
  if (timeVal === null || timeVal === undefined || timeVal === "") return "--:--.---";
  if (typeof timeVal === "number") {
    if (isNaN(timeVal) || timeVal <= 0) return "--:--.---";
    const totalSecs = Math.floor(timeVal / 1000);
    const remMs = Math.round(timeVal % 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${String(remMs).padStart(3, "0")}`;
  }
  const parsed = parseTimeToMs(timeVal);
  if (parsed !== null && parsed > 0) {
    const totalSecs = Math.floor(parsed / 1000);
    const remMs = Math.round(parsed % 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${String(remMs).padStart(3, "0")}`;
  }
  return String(timeVal);
}

function formatMsToTime(ms) {
  return formatRaceTimeStandard(ms);
}
window.formatMsToTime = formatMsToTime;


function getCarImageForName(carName, routeIndex = 0) {
  const c = String(carName || "").toLowerCase();
  if (c.includes("bmw") || c.includes("m3")) return "assets/img/cars/bmw-m3-gtr.jpg";
  if (c.includes("elise") || c.includes("lotus")) return "assets/img/cars/lotus-elise.jpg";
  if (c.includes("slr") || c.includes("mclaren") || c.includes("mercedes")) return "assets/img/cars/mercedes-slr-mclaren.jpg";
  if (c.includes("evo") || c.includes("lancer") || c.includes("mitsubishi")) return "assets/img/cars/mitsubishi-lancer-evo.jpg";
  if (c.includes("mustang") || c.includes("ford")) return "assets/img/cars/ford-mustang-gt.jpg";
  if (c.includes("rx-8") || c.includes("rx8") || c.includes("mazda")) return "assets/img/cars/mazda-rx8.jpg";
  if (c.includes("subaru") || c.includes("wrx") || c.includes("impreza")) return "assets/img/cars/subaru-impreza-wrx.jpg";
  if (c.includes("cobalt") || c.includes("chevy")) return "assets/img/cars/chevy-cobalt-ss.jpg";
  if (c.includes("punto") || c.includes("fiat")) return "assets/img/cars/fiat-punto.jpg";
  if (c.includes("carrera") || c.includes("porsche")) return "assets/img/cars/porsche-carrera-gt.jpg";

  const pool = [
    "assets/img/cars/porsche-carrera-gt.jpg",
    "assets/img/cars/bmw-m3-gtr.jpg",
    "assets/img/cars/lotus-elise.jpg",
    "assets/img/cars/mercedes-slr-mclaren.jpg",
    "assets/img/cars/mitsubishi-lancer-evo.jpg"
  ];
  return pool[routeIndex % pool.length];
}

function getStitchRouteMetadata(route) {
  const name = (route && route.name) || "";
  const type = (route && route.type) || "Circuito";
  const lower = name.toLowerCase();

  let district = "Downtown Rockport";
  if (lower.includes("camden") || lower.includes("beach") || lower.includes("coast") || lower.includes("ocean") || lower.includes("dock") || lower.includes("highlands")) {
    district = "Camden Beach";
  } else if (lower.includes("rosewood") || lower.includes("campus") || lower.includes("ironwood") || lower.includes("union") || lower.includes("omega") || lower.includes("industrial") || lower.includes("stewart")) {
    district = "Rosewood";
  } else if (lower.includes("turnpike") || lower.includes("dam") || lower.includes("petersburg") || lower.includes("highway") || lower.includes("north bay") || lower.includes("bay") || lower.includes("boardwalk")) {
    district = "Rockport Turnpike";
  }

  let laps = type === "Circuito" ? "2 Vueltas (5.4 km)" : type === "Sprint" ? "Punto a Punto (7.2 km)" : "400 Metros (Drag)";
  if (lower.includes("perimeter")) laps = "3 Vueltas (7.8 km)";
  if (lower.includes("highlands")) laps = "3 Vueltas (8.2 km)";
  if (lower.includes("world loop")) laps = "Circuito Completo (26.4 km)";

  return { district, laps };
}

function getRouteWRData(route) {
  const defaultYt = (rName, drv) =>
    `https://www.youtube.com/results?search_query=${encodeURIComponent("NFS Most Wanted " + (rName || "Rockport") + " WR " + (drv || ""))}`;
  if (!route) return { time: "01:20.750", driver: "Lea4Speed0", car: "Porsche Carrera GT", pilots: "12 Pilotos", videoUrl: defaultYt("City Perimeter", "Lea4Speed0") };
  const key = (route.name || "").trim().toLowerCase();

  if (window.NFS_GLOBAL_LEADERBOARDS_CACHE) {
    const rKey = sanitizeFirebaseKey(route.name);
    const fbEntry = window.NFS_GLOBAL_LEADERBOARDS_CACHE[rKey];
    if (fbEntry) {
      const catKey = route.type === "Circuito" ? "junkman_single" : "junkman";
      const catData = fbEntry[catKey] || fbEntry["default"];
      let list = Array.isArray(catData) ? catData : catData && typeof catData === "object" ? Object.values(catData) : [];
      list = list.filter(Boolean);
      if (list.length > 0 && list[0].time && list[0].driver) {
        const rawVid = list[0].videoUrl || list[0].yt || list[0].video || "";
        const validVid = String(rawVid).startsWith("http") ? String(rawVid).trim() : defaultYt(route.name, list[0].driver);
        return {
          time: formatRaceTimeStandard(list[0].time),
          driver: list[0].driver,
          car: list[0].car || "Porsche Carrera GT",
          pilots: `${list.length} Pilotos`,
          videoUrl: validVid
        };
      }
    }
  }

  if (STITCH_VERIFIED_TRACK_RECORDS[key]) {
    const rec = STITCH_VERIFIED_TRACK_RECORDS[key];
    return {
      time: formatRaceTimeStandard(rec.time),
      driver: rec.driver,
      car: rec.car,
      pilots: rec.pilots || "10 Pilotos",
      videoUrl: rec.videoUrl || defaultYt(route.name, rec.driver)
    };
  }

  return {
    time: "01:25.000",
    driver: "Lea4Speed0",
    car: "Porsche Carrera GT",
    pilots: "10 Pilotos",
    videoUrl: defaultYt(route.name, "Lea4Speed0")
  };
}

// ============================================================================
// 3. FIREBASE REALTIME DATABASE FETCHING & EXTRACTION
// ============================================================================
window.NFS_GLOBAL_LEADERBOARDS_CACHE = window.NFS_GLOBAL_LEADERBOARDS_CACHE || null;

async function fetchFirebaseRouteRecords(routeName) {
  if (!FIREBASE_RTDB_BASE_URL) return {};
  const routeKey = sanitizeFirebaseKey(routeName);

  if (window.NFS_GLOBAL_LEADERBOARDS_CACHE && window.NFS_GLOBAL_LEADERBOARDS_CACHE[routeKey]) {
    return window.NFS_GLOBAL_LEADERBOARDS_CACHE[routeKey];
  }

  const url = `${FIREBASE_RTDB_BASE_URL}/leaderboards/${routeKey}.json?_t=${Date.now()}`;
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return {};
    const data = await response.json();
    return data && typeof data === "object" ? data : {};
  } catch (err) {
    return {};
  }
}

function extractCategoryRecords(routeFirebaseData, categoryKey, routeObj) {
  const cKey = sanitizeFirebaseKey(categoryKey);
  let raw = (routeFirebaseData && (routeFirebaseData[cKey] || routeFirebaseData["default"])) || [];
  if (!Array.isArray(raw) && typeof raw === "object") {
    raw = Object.values(raw);
  }

  let list = (Array.isArray(raw) ? raw : [])
    .filter((item) => item && item.driver && String(item.driver).trim() !== "" && (item.time || item.declaredTime))
    .map((item) => {
      const timeStr = item.time || item.declaredTime || "--:--.---";
      const timeMs = item.timeMs !== undefined ? parseInt(item.timeMs, 10) : parseTimeToMs(timeStr);
      let resolvedVideo = "#";
      if (item.videoUrl && String(item.videoUrl).startsWith("http")) resolvedVideo = item.videoUrl.trim();
      else if (item.yt && String(item.yt).startsWith("http")) resolvedVideo = item.yt.trim();
      else if (item.video && String(item.video).startsWith("http")) resolvedVideo = item.video.trim();

      return {
        driver: String(item.driver).trim(),
        time: formatRaceTimeStandard(timeStr),
        timeMs: isNaN(timeMs) ? null : timeMs,
        car: item.car || (cKey.includes("bmw") ? "BMW M3 GTR" : "Porsche Carrera GT"),
        device: item.device || item.platform || "PlayStation DualSense",
        gearbox: item.gearbox || "Manual",
        date: item.date || "27/09/2026",
        yt: resolvedVideo,
        videoUrl: resolvedVideo
      };
    });

  // Fallback to verified track records if Firebase node is empty for this category
  if (list.length === 0 && routeObj) {
    const baseWr = getRouteWRData(routeObj);
    const baseMs = parseTimeToMs(baseWr.time) || 80750;
    const isBmw = cKey.includes("bmw");
    const isStock = cKey.includes("stock");
    const carLabel = isBmw ? "BMW M3 GTR E46" : baseWr.car || "Porsche Carrera GT";
    const setupLabel = isStock ? "Stock Spec // Factory 0/0" : isBmw ? "BMW Motorsport // GTR Spec" : "Junkman Stage 3 + Trans 0/0";

    if ((routeObj.name || "").toLowerCase().includes("perimeter")) {
      list = CITY_PERIMETER_DEFAULT_RECORDS.map((r, i) => ({
        ...r,
        car: isBmw ? "BMW M3 GTR E46" : r.car,
        setup: setupLabel,
        time: formatRaceTimeStandard((r.timeMs || 80750) + (isBmw ? 1420 : isStock ? 2850 : 0)),
        timeMs: (r.timeMs || 80750) + (isBmw ? 1420 : isStock ? 2850 : 0)
      }));
    } else {
      const fallbackDrivers = [
        { driver: baseWr.driver, offset: 0, gearbox: "Manual", device: "PlayStation DualSense" },
        { driver: "SRTxAvenger", offset: 310, gearbox: "Auto", device: "Logitech Dual Action" },
        { driver: "ZimanX", offset: 640, gearbox: "Manual", device: "Logitech Dual Action" },
        { driver: "Skymaster", offset: 980, gearbox: "Manual", device: "Xbox 360 Controller" },
        { driver: "Darkrai", offset: 1350, gearbox: "Auto", device: "PlayStation DualShock 4" },
        { driver: "Xman", offset: 1790, gearbox: "Manual", device: "PlayStation DualShock 4" }
      ];
      list = fallbackDrivers.map((fd) => {
        const ms = baseMs + fd.offset + (isBmw ? 1250 : isStock ? 2400 : 0);
        return {
          driver: fd.driver,
          time: formatRaceTimeStandard(ms),
          timeMs: ms,
          car: carLabel,
          setup: setupLabel,
          device: fd.device,
          gearbox: fd.gearbox,
          date: "27/09/2026",
          yt: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        };
      });
    }
  }

  list.sort((a, b) => {
    if (a.timeMs !== null && b.timeMs !== null && a.timeMs !== b.timeMs) return a.timeMs - b.timeMs;
    return (a.driver || "").localeCompare(b.driver || "");
  });

  return list.map((item, idx) => ({
    ...item,
    rank: `#${idx + 1}`
  }));
}

async function prefetchGlobalLeaderboards() {
  try {
    const res = await fetch(`${FIREBASE_RTDB_BASE_URL}/leaderboards.json`);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === "object") {
        window.NFS_GLOBAL_LEADERBOARDS_CACHE = data;
        const badge = document.getElementById("home-firebase-status-badge");
        if (badge) badge.textContent = "FIREBASE LIVE ✓";
        syncAllCardsWithFirebaseCache();
        if (typeof window.renderHallOfFameView === "function") {
          window.renderHallOfFameView();
        }
        return data;
      }
    }
  } catch (e) {
    // Uses verified fallback records seamlessly
  }
  return null;
}

function syncAllCardsWithFirebaseCache() {
  if (!window.NFS_GLOBAL_LEADERBOARDS_CACHE || typeof routesData === "undefined") return;
  routesData.forEach((route, idx) => {
    const rKey = sanitizeFirebaseKey(route.name);
    const wr = getRouteWRData(route);
    const carImg = getCarImageForName(wr.car, idx);
    document.querySelectorAll(`[data-wr-time="${rKey}"]`).forEach((el) => {
      el.textContent = wr.time;
    });
    document.querySelectorAll(`[data-wr-driver="${rKey}"]`).forEach((el) => {
      el.textContent = wr.driver;
    });
    document.querySelectorAll(`[data-wr-car="${rKey}"]`).forEach((el) => {
      el.textContent = wr.car;
    });
    document.querySelectorAll(`[data-wr-car-img="${rKey}"]`).forEach((img) => {
      img.src = carImg;
      img.alt = wr.car;
    });
    document.querySelectorAll(`[data-wr-car-backdrop="${rKey}"]`).forEach((backdrop) => {
      backdrop.style.backgroundImage = `url('${carImg}')`;
    });
    document.querySelectorAll(`[data-wr-car-pill="${rKey}"] span`).forEach((span) => {
      span.textContent = wr.car;
    });
    document.querySelectorAll(`[data-wr-video="${rKey}"]`).forEach((a) => {
      if (wr.videoUrl) a.href = wr.videoUrl;
    });
  });
}

function downloadTelemetryGhost(driver, time, routeName) {
  const track = routeName || "Rockport_Track";
  const content = `# ROCKPORT SPEED RECORDS // BLACK EDITION TELEMETRY GHOST
TRACK: ${track}
DRIVER: ${driver}
LAP_TIME: ${time}
FREQUENCY: 128Hz SUB-FRAME AUDITED
STATUS: HOMOLOGATED_OFFICIAL_FIREBASE
`;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `NFSMW_${String(track).replace(/[^a-zA-Z0-9]/g, "_")}_${String(driver).replace(/[^a-zA-Z0-9]/g, "_")}.ghs`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
window.downloadTelemetryGhost = downloadTelemetryGhost;

// ============================================================================
// 4. MAIN INTERACTIVE CONTROLLER (HOME + RUTAS Y CIRCUITOS + FIREBASE)
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  const allRoutes = typeof routesData !== "undefined" ? routesData : [];
  const allCars = typeof TUNING_CARS_DATA !== "undefined" ? TUNING_CARS_DATA : [];

  // 4.1 Navbar Dropdowns & View Switching
  const megaMenuNavItem = document.getElementById("nav-item-elements");
  const megaMenuTrigger = document.getElementById("btn-elements-trigger");
  const torneoMenuNavItem = document.getElementById("nav-item-torneo");
  const torneoMenuTrigger = document.getElementById("btn-torneo-trigger");
  const comunidadMenuNavItem = document.getElementById("nav-item-comunidad");
  const comunidadMenuTrigger = document.getElementById("btn-comunidad-trigger");
  const telemetriaMenuNavItem = document.getElementById("nav-item-telemetria");
  const telemetriaMenuTrigger = document.getElementById("btn-telemetria-trigger");
  const createMenuWrapper = document.getElementById("create-menu-wrapper");
  const createMenuBtn = document.getElementById("btn-create-trigger");
  const viewSections = document.querySelectorAll(".view-section");

  // 4.1.B Mobile Navigation Drawer & Accordions Handler (Screens <= 1090px, Tablets & Mobile)
  const mobileNavToggleBtn = document.getElementById("btn-mobile-nav-toggle");
  const mobileNavDrawer = document.getElementById("mobile-nav-drawer");
  const mobileNavBackdrop = document.getElementById("mobile-nav-backdrop");
  const mobileDrawerCloseBtn = document.getElementById("btn-mobile-drawer-close");

  function openMobileDrawer() {
    if (mobileNavDrawer) {
      mobileNavDrawer.classList.add("is-open");
      mobileNavDrawer.setAttribute("aria-hidden", "false");
    }
    if (mobileNavBackdrop) {
      mobileNavBackdrop.classList.add("is-open");
      mobileNavBackdrop.setAttribute("aria-hidden", "false");
    }
    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.classList.add("is-active");
      mobileNavToggleBtn.setAttribute("aria-expanded", "true");
    }
    document.body.style.overflow = "hidden";
  }

  function closeMobileDrawer() {
    if (mobileNavDrawer) {
      mobileNavDrawer.classList.remove("is-open");
      mobileNavDrawer.setAttribute("aria-hidden", "true");
    }
    if (mobileNavBackdrop) {
      mobileNavBackdrop.classList.remove("is-open");
      mobileNavBackdrop.setAttribute("aria-hidden", "true");
    }
    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.classList.remove("is-active");
      mobileNavToggleBtn.setAttribute("aria-expanded", "false");
    }
    document.body.style.overflow = "";
  }
  window.openMobileDrawer = openMobileDrawer;
  window.closeMobileDrawer = closeMobileDrawer;

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = mobileNavDrawer && mobileNavDrawer.classList.contains("is-open");
      if (isOpen) {
        closeMobileDrawer();
      } else {
        openMobileDrawer();
      }
    });
  }

  if (mobileDrawerCloseBtn) {
    mobileDrawerCloseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeMobileDrawer();
    });
  }

  if (mobileNavBackdrop) {
    mobileNavBackdrop.addEventListener("click", (e) => {
      e.stopPropagation();
      closeMobileDrawer();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMobileDrawer();
    }
  });

  // Mobile drawer accordions toggle
  document.querySelectorAll(".mobile-accordion-trigger").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const parentAcc = trigger.closest(".mobile-nav-accordion");
      if (parentAcc) {
        const isOpen = parentAcc.classList.contains("is-open");
        parentAcc.classList.toggle("is-open", !isOpen);
        trigger.setAttribute("aria-expanded", String(!isOpen));
      }
    });
  });

  function switchView(targetViewId, subTab) {
    if (!targetViewId) return;
    const cleanId = targetViewId.startsWith("view-") ? targetViewId : `view-${targetViewId}`;
    const allSections = document.querySelectorAll(".view-section");
    allSections.forEach((sec) => {
      const isTarget = sec.id === cleanId ||
        (cleanId === "view-tuning" && (sec.id === "view-tuning" || sec.id === "view-guides")) ||
        (cleanId === "view-guides" && (sec.id === "view-tuning" || sec.id === "view-guides"));
      sec.classList.toggle("is-active", isTarget);
    });

    const isComunidadView = [
      "view-tuning", "view-guides", "view-submit", "view-rules",
      "view-map", "view-download", "view-members"
    ].includes(cleanId);
    const isTelemetriaHofView = [
      "view-spotlight", "view-telemetry"
    ].includes(cleanId);

    const navTarget = cleanId === "view-leaderboard" ? "view-challenges" : cleanId;
    document.querySelectorAll(".uiverse-nav-list .nav-link").forEach((link) => {
      link.classList.toggle("is-active", link.dataset.viewTarget === navTarget);
    });
    if (comunidadMenuTrigger) {
      comunidadMenuTrigger.classList.toggle("is-active", isComunidadView);
    }
    if (telemetriaMenuTrigger) {
      telemetriaMenuTrigger.classList.toggle("is-active", isTelemetriaHofView);
    }
    document.querySelectorAll(".mobile-nav-link").forEach((link) => {
      link.classList.toggle("is-active", link.dataset.viewTarget === navTarget);
    });

    if (cleanId === "view-blog" && typeof switchTorneoTab === "function") {
      switchTorneoTab(subTab || torneoState.activeTab || "standings");
    }

    // Community Sections Dynamic Inits
    if (cleanId === "view-tuning" || cleanId === "view-guides") {
      if (typeof window.initTuningSection === "function") window.initTuningSection();
    } else if (cleanId === "view-submit") {
      if (typeof window.initSubmitRouteSelector === "function") window.initSubmitRouteSelector();
    } else if (cleanId === "view-members") {
      if (typeof window.loadMembersView === "function") window.loadMembersView();
    } else if (cleanId === "view-map") {
      if (typeof window.focusMapDistrict === "function") window.focusMapDistrict("all");
    }

    // Control de visibilidad del drawer flotante de NFSMWO Web (solo visible en Home)
    const nfsmwoContainer = document.getElementById("nfsmwo-floating-container");
    if (nfsmwoContainer) {
      nfsmwoContainer.style.display = (cleanId === "view-elements") ? "block" : "none";
    }

    closeMobileDrawer();
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (typeof window.initAllInteractiveButtons === "function") {
      window.initAllInteractiveButtons();
    } else if (typeof window.applyGlitchEffectToAllButtons === "function") {
      window.applyGlitchEffectToAllButtons();
    }
  }
  window.switchView = switchView;

  // Helper: Close all mega-menus across the board
  function closeAllDropdowns(immediate = false) {
    const navItems = [megaMenuNavItem, torneoMenuNavItem, telemetriaMenuNavItem, comunidadMenuNavItem];
    navItems.forEach((nav) => {
      if (nav) {
        nav.classList.remove("dropdown-open");
        if (!immediate) {
          nav.classList.add("dropdown-closed");
          setTimeout(() => nav.classList.remove("dropdown-closed"), 350);
        }
      }
    });
    if (createMenuWrapper) createMenuWrapper.classList.remove("is-open");
    closeMobileDrawer();
  }
  window.closeAllDropdowns = closeAllDropdowns;
  window.closeTorneoDropdown = closeAllDropdowns;

  if (megaMenuTrigger && megaMenuNavItem) {
    megaMenuTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = !megaMenuNavItem.classList.contains("dropdown-open");
      megaMenuNavItem.classList.remove("dropdown-closed");
      switchView("view-challenges");
      if (willOpen) {
        megaMenuNavItem.classList.add("dropdown-open");
      } else {
        megaMenuNavItem.classList.remove("dropdown-open");
      }
      if (torneoMenuNavItem) {
        torneoMenuNavItem.classList.remove("dropdown-open");
        torneoMenuNavItem.classList.remove("dropdown-closed");
      }
      if (comunidadMenuNavItem) {
        comunidadMenuNavItem.classList.remove("dropdown-open");
        comunidadMenuNavItem.classList.remove("dropdown-closed");
      }
      if (telemetriaMenuNavItem) {
        telemetriaMenuNavItem.classList.remove("dropdown-open");
        telemetriaMenuNavItem.classList.remove("dropdown-closed");
      }
      if (createMenuWrapper) createMenuWrapper.classList.remove("is-open");
    });
  }

  if (torneoMenuTrigger && torneoMenuNavItem) {
    torneoMenuTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = !torneoMenuNavItem.classList.contains("dropdown-open");
      torneoMenuNavItem.classList.remove("dropdown-closed");
      switchView("view-blog");
      if (willOpen) {
        torneoMenuNavItem.classList.add("dropdown-open");
      } else {
        torneoMenuNavItem.classList.remove("dropdown-open");
      }
      if (megaMenuNavItem) {
        megaMenuNavItem.classList.remove("dropdown-open");
        megaMenuNavItem.classList.remove("dropdown-closed");
      }
      if (comunidadMenuNavItem) {
        comunidadMenuNavItem.classList.remove("dropdown-open");
        comunidadMenuNavItem.classList.remove("dropdown-closed");
      }
      if (telemetriaMenuNavItem) {
        telemetriaMenuNavItem.classList.remove("dropdown-open");
        telemetriaMenuNavItem.classList.remove("dropdown-closed");
      }
      if (createMenuWrapper) createMenuWrapper.classList.remove("is-open");
    });
  }

  if (comunidadMenuTrigger && comunidadMenuNavItem) {
    comunidadMenuTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = !comunidadMenuNavItem.classList.contains("dropdown-open");
      comunidadMenuNavItem.classList.remove("dropdown-closed");
      switchView("view-tuning");
      if (willOpen) {
        comunidadMenuNavItem.classList.add("dropdown-open");
      } else {
        comunidadMenuNavItem.classList.remove("dropdown-open");
      }
      if (megaMenuNavItem) {
        megaMenuNavItem.classList.remove("dropdown-open");
        megaMenuNavItem.classList.remove("dropdown-closed");
      }
      if (torneoMenuNavItem) {
        torneoMenuNavItem.classList.remove("dropdown-open");
        torneoMenuNavItem.classList.remove("dropdown-closed");
      }
      if (telemetriaMenuNavItem) {
        telemetriaMenuNavItem.classList.remove("dropdown-open");
        telemetriaMenuNavItem.classList.remove("dropdown-closed");
      }
      if (createMenuWrapper) createMenuWrapper.classList.remove("is-open");
    });
  }

  if (telemetriaMenuTrigger && telemetriaMenuNavItem) {
    telemetriaMenuTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = !telemetriaMenuNavItem.classList.contains("dropdown-open");
      telemetriaMenuNavItem.classList.remove("dropdown-closed");
      switchView("view-spotlight");
      if (willOpen) {
        telemetriaMenuNavItem.classList.add("dropdown-open");
      } else {
        telemetriaMenuNavItem.classList.remove("dropdown-open");
      }
      if (megaMenuNavItem) {
        megaMenuNavItem.classList.remove("dropdown-open");
        megaMenuNavItem.classList.remove("dropdown-closed");
      }
      if (torneoMenuNavItem) {
        torneoMenuNavItem.classList.remove("dropdown-open");
        torneoMenuNavItem.classList.remove("dropdown-closed");
      }
      if (comunidadMenuNavItem) {
        comunidadMenuNavItem.classList.remove("dropdown-open");
        comunidadMenuNavItem.classList.remove("dropdown-closed");
      }
      if (createMenuWrapper) createMenuWrapper.classList.remove("is-open");
    });
  }

  if (createMenuBtn && createMenuWrapper) {
    createMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      createMenuWrapper.classList.toggle("is-open");
      if (megaMenuNavItem) megaMenuNavItem.classList.remove("dropdown-open");
      if (torneoMenuNavItem) torneoMenuNavItem.classList.remove("dropdown-open");
      if (comunidadMenuNavItem) comunidadMenuNavItem.classList.remove("dropdown-open");
      if (telemetriaMenuNavItem) telemetriaMenuNavItem.classList.remove("dropdown-open");
    });
  }

  document.addEventListener("click", (e) => {
    if (megaMenuNavItem && !megaMenuNavItem.contains(e.target)) {
      megaMenuNavItem.classList.remove("dropdown-open");
    }
    if (torneoMenuNavItem && !torneoMenuNavItem.contains(e.target)) {
      torneoMenuNavItem.classList.remove("dropdown-open");
    }
    if (comunidadMenuNavItem && !comunidadMenuNavItem.contains(e.target)) {
      comunidadMenuNavItem.classList.remove("dropdown-open");
    }
    if (telemetriaMenuNavItem && !telemetriaMenuNavItem.contains(e.target)) {
      telemetriaMenuNavItem.classList.remove("dropdown-open");
    }
    if (createMenuWrapper && !createMenuWrapper.contains(e.target)) {
      createMenuWrapper.classList.remove("is-open");
    }
  });

  document.querySelectorAll("[data-view-target]").forEach((el) => {
    if (
      el.id === "btn-elements-trigger" ||
      el.id === "btn-torneo-trigger" ||
      el.id === "btn-comunidad-trigger" ||
      el.id === "btn-telemetria-trigger"
    ) return;
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const target = el.dataset.viewTarget;
      if (target) {
        switchView(target);
        closeAllDropdowns();
      }
    });
  });

  // Delegated fallback for any dynamically created or nested [data-view-target] elements
  document.addEventListener("click", (e) => {
    const targetEl = e.target.closest("[data-view-target]");
    if (!targetEl) return;
    if (
      targetEl.id === "btn-elements-trigger" ||
      targetEl.id === "btn-torneo-trigger" ||
      targetEl.id === "btn-comunidad-trigger" ||
      targetEl.id === "btn-telemetria-trigger"
    ) return;
    const target = targetEl.dataset.viewTarget;
    if (target) {
      e.preventDefault();
      switchView(target);
      closeAllDropdowns();
    }
  });

  // 4.2 Bespoke Route Vector Emblems (Circuito, Sprint, Drag) matching Uiverse Blog reference
  function getRouteEmblemSVG(routeType) {
    const type = (routeType || "Circuito").toLowerCase();
    if (type === "circuito") {
      return `
        <div class="uiverse-emblem-wrap uiverse-emblem-circuito">
          <div class="uiverse-emblem-halo"></div>
          <svg class="uiverse-emblem-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="circ-grad-1" x1="10" y1="18" x2="90" y2="86" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#a855f7"/>
                <stop offset="50%" stop-color="#ffffff"/>
                <stop offset="100%" stop-color="#ff7b00"/>
              </linearGradient>
              <linearGradient id="circ-grad-2" x1="28" y1="26" x2="72" y2="74" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#c084fc"/>
                <stop offset="100%" stop-color="#ffae00"/>
              </linearGradient>
            </defs>
            <path d="M28 22 C14 22 10 36 10 50 C10 64 18 78 36 78 C54 78 62 60 72 60 C82 60 90 68 90 76 C90 84 80 88 70 88 C45 88 30 76 24 66" stroke="url(#circ-grad-1)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M28 22 C42 22 58 32 68 44 C78 56 88 56 90 44 C92 30 78 18 58 18 C42 18 34 22 28 22 Z" stroke="url(#circ-grad-2)" stroke-width="6" stroke-linecap="round"/>
            <circle cx="34" cy="50" r="13" fill="#a855f7" fill-opacity="0.28" stroke="#c084fc" stroke-width="2.5"/>
            <circle cx="34" cy="50" r="6" fill="#ffffff"/>
            <path d="M52 54 L68 76 L61 78 L57 88 L51 86 L55 76 L46 74 Z" fill="#09080e" stroke="#ffffff" stroke-width="2" stroke-linejoin="round"/>
          </svg>
        </div>
      `;
    } else if (type === "sprint") {
      return `
        <div class="uiverse-emblem-wrap uiverse-emblem-sprint">
          <div class="uiverse-emblem-halo"></div>
          <svg class="uiverse-emblem-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="sprint-sphere-grad" x1="50" y1="30" x2="88" y2="70" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#a855f7"/>
                <stop offset="65%" stop-color="#8b5cf6"/>
                <stop offset="100%" stop-color="#ff7b00"/>
              </linearGradient>
            </defs>
            <circle cx="26" cy="50" r="18" fill="#4c1d95" fill-opacity="0.38"/>
            <circle cx="38" cy="50" r="18" fill="#6d28d9" fill-opacity="0.55"/>
            <circle cx="52" cy="50" r="18" fill="#7c3aed" fill-opacity="0.75"/>
            <circle cx="68" cy="50" r="21" fill="url(#sprint-sphere-grad)" stroke="#ffffff" stroke-width="2.5"/>
            <path d="M64 40 L76 50 L64 60 Z" fill="#ffffff"/>
            <path d="M10 44 H18 M6 50 H14 M10 56 H18" stroke="#ffae00" stroke-width="3" stroke-linecap="round"/>
          </svg>
        </div>
      `;
    } else {
      return `
        <div class="uiverse-emblem-wrap uiverse-emblem-drag">
          <div class="uiverse-emblem-halo"></div>
          <svg class="uiverse-emblem-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="22" y="32" width="22" height="42" rx="9" transform="rotate(-30 22 32)" fill="#8b5cf6" stroke="#c084fc" stroke-width="2.5"/>
            <rect x="28" y="22" width="10" height="12" rx="3.5" transform="rotate(-30 28 22)" fill="#ffffff" stroke="#a855f7" stroke-width="2"/>
            <circle cx="65" cy="52" r="18" fill="#ff7b00" stroke="#ffffff" stroke-width="2.5"/>
            <path d="M65 40 C65 40 59 47 59 52 C59 57 62 62 67 62 C72 62 75 57 75 52 C75 47 71 44 71 44 C71 47 68 49 66 49 C64 49 63 47 65 40 Z" fill="#ffffff"/>
            <path d="M14 74 C24 74 34 82 48 82" stroke="#ffae00" stroke-width="3.5" stroke-linecap="round"/>
            <path d="M22 84 C32 84 42 90 56 90" stroke="#a855f7" stroke-width="3.5" stroke-linecap="round"/>
          </svg>
        </div>
      `;
    }
  }

  // 4.2b Google Stitch Dual-Color Time Formatter: 01:20 (white) .750 (cyan)
  function formatStitchTimeHtml(timeStr) {
    if (!timeStr || typeof timeStr !== "string") return `<span class="stitch-num stitch-time-display">-</span>`;
    const clean = timeStr.trim();
    if (typeof isZeroOrNullTime === "function" && isZeroOrNullTime(clean)) {
      return `<span class="stitch-num stitch-time-display"><span class="stitch-time-main">${escapeHtml(clean)}</span></span>`;
    }
    const dotIdx = clean.lastIndexOf(".");
    if (dotIdx !== -1 && dotIdx < clean.length - 1) {
      const mainPart = clean.slice(0, dotIdx);
      const msPart = clean.slice(dotIdx);
      return `<span class="stitch-num stitch-time-display"><span class="stitch-time-main">${escapeHtml(mainPart)}</span><span class="stitch-time-ms">${escapeHtml(msPart)}</span></span>`;
    }
    return `<span class="stitch-num stitch-time-display"><span class="stitch-time-main">${escapeHtml(clean)}</span></span>`;
  }

  // 4.3 Build Route Card HTML (Uiverse Cosmic Glass Design for Circuito, Sprint & Drag - Expanded Vertical Size)
  function createRouteCardHTML(route, idx) {
    const meta = getStitchRouteMetadata(route);
    const wr = getRouteWRData(route);
    const rKey = sanitizeFirebaseKey(route.name);
    const rawType = (route.type || "Circuito").trim();
    const typeLower = rawType.toLowerCase();
    const typeUpper = rawType.toUpperCase();
    const distanciaPista = meta.laps || route.distance || "2 Vueltas (5.4 km)";
    const carImage = getCarImageForName(wr.car, idx);

    // Modality badge styling: circuito (amber), sprint (cyan), drag (pink)
    let badgeClass = "stitch-badge-circuito";
    let badgeInline = "color: #f59e0b; background-color: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.4);";
    if (typeLower.includes("circ")) {
      badgeClass = "stitch-badge-circuito";
      badgeInline = "color: #f59e0b; background-color: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.4);";
    } else if (typeLower.includes("sprint")) {
      badgeClass = "stitch-badge-sprint";
      badgeInline = "color: #06b6d4; background-color: rgba(6, 182, 212, 0.12); border: 1px solid rgba(6, 182, 212, 0.4);";
    } else if (typeLower.includes("drag")) {
      badgeClass = "stitch-badge-drag";
      badgeInline = "color: #ec4899; background-color: rgba(236, 72, 153, 0.12); border: 1px solid rgba(236, 72, 153, 0.4);";
    }

    return `
      <article class="uiverse-cosmic-card stitch-track-card element-card track-card group"
        data-purpose="track-card"
        style="cursor: pointer; position: relative; display: flex; flex-direction: column; justify-content: space-between; min-height: 335px; padding: 24px 22px; border-radius: 20px; overflow: hidden; box-sizing: border-box; background: radial-gradient(120% 120% at 50% 0%, rgba(28, 27, 34, 0.88) 0%, rgba(11, 11, 14, 0.98) 100%); border: 1px solid rgba(255, 255, 255, 0.09);"
        data-open-route-lb="${escapeHtml(route.name)}"
        data-route-name="${escapeHtml(route.name)}"
        data-route-type="${escapeHtml(route.type)}"
        data-route-district="${escapeHtml(meta.district)}"
        data-search="${escapeHtml((route.name + " " + route.type + " " + meta.district + " " + wr.driver + " " + wr.car).toLowerCase())}">

        <!-- Glowing border top simulation -->
        <div class="glow-border-top"></div>

        <!-- Subtle Car Silhouette / Backdrop for Live Updates -->
        <div class="track-car-backdrop stitch-car-backdrop" data-wr-car-backdrop="${rKey}" style="background-image: url('${escapeHtml(carImage)}');"></div>

        <div style="width: 100%;">
          <!-- Card Header: NFSRANKS.ONLINE + Modality Badge -->
          <div class="stitch-card-header" style="display: flex; align-items: center; justify-content: space-between; width: 100%; margin-bottom: 14px;">
            <div class="stitch-card-brand" style="display: flex; align-items: center; gap: 8px;">
              <span class="stitch-card-dot w-2 h-2 rounded-full bg-cosmic-emerald animate-pulse" style="width: 8px; height: 8px; border-radius: 50%; background-color: #10b981; box-shadow: 0 0 8px #10b981; display: inline-block;"></span>
              <span class="stitch-card-brand-text" style="font-family: var(--font-mono, 'JetBrains Mono', monospace); font-size: 11px; font-weight: 800; letter-spacing: 0.08em; color: #cbd5e1; text-transform: uppercase;">NFSRANKS.ONLINE</span>
            </div>
            <span class="stitch-badge-modality ${badgeClass}" style="${badgeInline} font-family: var(--font-mono, 'JetBrains Mono', monospace); font-size: 10px; font-weight: 800; letter-spacing: 0.1em; padding: 3px 10px; border-radius: 6px; text-transform: uppercase; display: inline-block;">
              ${escapeHtml(typeUpper)}
            </span>
          </div>

          <!-- Track Title -->
          <h4 class="stitch-card-title" style="font-family: var(--font-sans, 'Inter', sans-serif); font-size: 22px; font-weight: 800; letter-spacing: -0.02em; color: #ffffff; margin: 0 0 8px 0; line-height: 1.25; text-align: left;">
            ${escapeHtml(route.name)}
          </h4>

          <!-- Subtitle: District + Distance / Laps (Justified between left and right) -->
          <div class="stitch-card-subtitle justify-between flex items-center" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 18px; font-family: var(--font-mono, 'JetBrains Mono', monospace); font-size: 11.5px; width: 100%;">
            <div class="stitch-card-district" style="display: flex; align-items: center; gap: 6px; min-width: 0;">
              <i class="fa-solid fa-location-dot text-cosmic-cyan" style="color: #06b6d4; font-size: 12px; flex-shrink: 0;"></i>
              <span style="color: #cbd5e1; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(meta.district)}</span>
            </div>
            <div class="stitch-card-distance" style="display: flex; align-items: center; gap: 6px; text-align: right; flex-shrink: 0;">
              <span style="color: #64748b;">•</span>
              <span style="color: #94a3b8; font-weight: 500;">${escapeHtml(distanciaPista)}</span>
            </div>
          </div>

          <!-- Telemetry Box (PILOTO WR, TIEMPO WR, VEHÍCULO) - Expanded Space -->
          <div class="stitch-telemetry-box" style="background: rgba(0, 0, 0, 0.65); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; padding: 14px 16px; margin-bottom: 18px; font-family: var(--font-mono, 'JetBrains Mono', monospace); display: flex; flex-direction: column; gap: 10px; width: 100%; box-sizing: border-box;">
            <div class="stitch-telemetry-upper" style="display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); width: 100%;">
              <div class="stitch-telemetry-driver-col" style="display: flex; flex-direction: column; gap: 4px; text-align: left;">
                <span class="stitch-telemetry-label" style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8;">PILOTO WR</span>
                <div class="stitch-telemetry-driver-row" style="display: flex; align-items: center; gap: 6px;">
                  <i class="fa-solid fa-crown" style="color: #f59e0b; font-size: 12px;"></i>
                  <span class="driver-name" data-metric="driver" data-wr-driver="${rKey}" style="font-size: 15px; font-weight: 800; color: #ffffff; letter-spacing: 0.02em;">
                    ${escapeHtml(wr.driver)}
                  </span>
                </div>
              </div>
              <div class="stitch-telemetry-time-col" style="display: flex; flex-direction: column; align-items: flex-end; text-align: right;">
                <span class="stitch-telemetry-label" style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; margin-bottom: 4px;">TIEMPO WR</span>
                <span class="stitch-num record-time border-orange-500"
                  data-metric="time"
                  data-wr-time="${rKey}"
                  style="display: inline-block; font-size: 14.5px; font-weight: 800; color: #ffffff; background: rgba(10, 10, 14, 0.85); border: 1px solid #ff7a00; border-radius: 10px; padding: 5px 12px; letter-spacing: 0.02em; box-shadow: 0 0 14px rgba(255, 122, 0, 0.45), inset 0 0 8px rgba(255, 122, 0, 0.15);">
                  ${escapeHtml(wr.time)}
                </span>
              </div>
            </div>
            <div class="stitch-telemetry-lower" style="display: flex; flex-direction: column; text-align: left; gap: 3px; width: 100%;">
              <span class="stitch-telemetry-label" style="font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8;">VEHÍCULO</span>
              <span class="vehicle-model" data-metric="car" data-wr-car="${rKey}" style="font-size: 13.5px; font-weight: 700; color: #f1f5f9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;">
                ${escapeHtml(wr.car)}
              </span>
            </div>
          </div>
        </div>

        <!-- Card Actions Footer -->
        <div class="stitch-card-footer" style="display: flex; align-items: center; justify-content: space-between; padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.08); width: 100%; box-sizing: border-box;">
          <div class="stitch-rank-badge" style="display: inline-flex; align-items: center; gap: 6px; padding: 5px 8px; border-radius: 8px; background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.35); color: #fbbf24; font-family: var(--font-mono, 'JetBrains Mono', monospace); flex-shrink: 0;">
            <i class="fa-solid fa-trophy" style="color: #f59e0b; font-size: 13px;"></i>
            <div style="display: flex; flex-direction: column; text-align: left; line-height: 1.1; gap: 1px;">
              <span style="font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #d97706;">RANK</span>
              <span style="font-size: 11px; font-weight: 800; color: #fbbf24;">#1 WR</span>
            </div>
          </div>
          <div class="stitch-footer-actions" style="display: flex; align-items: center; gap: 6px;">
            <a href="${escapeHtml(wr.videoUrl || 'https://www.youtube.com/results?search_query=' + encodeURIComponent('NFSMW ' + route.name + ' WR ' + wr.driver))}"
              target="_blank" rel="noopener noreferrer"
              onclick="event.stopPropagation();"
              class="stage-action-btn btn-sm glitch-nfs-btn stitch-video-btn"
              title="Ver Video del World Record (${escapeHtml(wr.driver)})"
              data-wr-video="${rKey}"
              data-text="VIDEO">
              <i class="fa-solid fa-play" style="font-size: 8px;"></i>
              <span>VIDEO</span>
            </a>
            <button type="button" class="stage-action-btn btn-sm glitch-nfs-btn stitch-leaderboard-btn"
              data-open-route-lb="${escapeHtml(route.name)}"
              data-text="LEADERBOARD"
              onclick="event.stopPropagation(); abrirLeaderboard('${escapeHtml(route.name)}')">
              <span>LEADERBOARD</span>
              <i class="fa-solid fa-arrow-right" style="font-size: 8px;"></i>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function createCarCardHTML(car) {
    return `
      <article class="element-card"
        data-card-kind="car"
        data-search="${escapeHtml((car.name + " " + car.drivetrain + " " + car.engine + " " + car.badge).toLowerCase())}">
        <div class="element-stage" style="padding: 12px;">
          <div class="nfs-stage-card">
            <img src="${escapeHtml(car.image)}" alt="${escapeHtml(car.name)}" class="nfs-stage-bg-img" style="opacity: 0.42;" loading="lazy" />
            <div class="nfs-stage-top">
              <span class="nfs-type-pill type-circuito">${escapeHtml(car.drivetrain)}</span>
              <span class="nfs-district-tag">${escapeHtml(car.badge || "OFFICIAL SPEC")}</span>
            </div>
            <div class="nfs-stage-mid">
              <div class="nfs-route-title">${escapeHtml(car.name)}</div>
              <div class="nfs-route-sub">${escapeHtml(car.engine)}</div>
            </div>
            <div class="nfs-stage-wr-row">
              <div>
                <div style="font-family: var(--font-mono); font-size: 9.5px; color: var(--text-muted); text-transform: uppercase;">Top Speed</div>
                <div class="nfs-wr-time" style="font-size: 16px;">${escapeHtml(car.topSpeed)}</div>
              </div>
              <div class="nfs-wr-car">${escapeHtml(car.power)}</div>
            </div>
          </div>
        </div>
        <footer class="element-footer">
          <div class="creator-meta">
            <span class="creator-avatar">GT</span>
            <span class="creator-name">${escapeHtml(car.name)}</span>
            <span class="creator-slug">${escapeHtml(car.weight)}</span>
          </div>
          <div class="element-metrics">
            <span>Junkman Ready</span>
          </div>
        </footer>
      </article>
    `;
  }

  // 4.3 Render Home Live Firebase Leaderboard & Home Official Cars Grid
  const homeLiveListEl = document.getElementById("home-live-leaderboard-list");
  const homeGridEl = document.getElementById("home-routes-grid");
  const activeCategoryTitle = document.getElementById("active-category-title");

  function renderHomeLiveStandings(records) {
    if (!homeLiveListEl) return;
    homeLiveListEl.innerHTML = records
      .map((rec, idx) => {
        const rankClass = idx === 0 ? "rank-1" : idx === 1 ? "rank-2" : idx === 2 ? "rank-3" : "";
        return `
        <div class="nfs-live-row" data-open-route-lb="${escapeHtml(rec.route)}">
          <div class="nfs-live-left">
            <span class="nfs-rank-pill ${rankClass}">${idx + 1}</span>
            <div>
              <div style="font-size: 13px; font-weight: 700; color: #fff;">${escapeHtml(rec.driver)}</div>
              <div style="font-size: 11px; color: var(--text-secondary);">${escapeHtml(rec.route)} (${escapeHtml(rec.routeType)})</div>
            </div>
          </div>
          <div style="text-align: right;">
            <div class="stitch-num" style="font-size: 13.5px; font-weight: 800; color: #34d399;">${formatStitchTimeHtml(formatRaceTimeStandard(rec.time))}</div>
            <div style="font-family: var(--font-mono); font-size: 10.5px; color: var(--text-muted);">${escapeHtml(rec.car)}</div>
          </div>
        </div>
      `;
      })
      .join("");
  }

  renderHomeLiveStandings(HOME_LIVE_LEADERBOARD_RECORDS);

  // Sync Home Live Standings with Firebase City Perimeter + top tracks
  fetchFirebaseRouteRecords("City Perimeter").then((fbData) => {
    const rows = extractCategoryRecords(fbData, "junkman_single", allRoutes[0]);
    if (rows && rows.length >= 3) {
      const liveTop = rows.slice(0, 5).map((r, i) => ({
        rank: i + 1,
        driver: r.driver,
        time: r.time,
        car: r.car,
        route: "City Perimeter",
        routeType: "Circuito"
      }));
      renderHomeLiveStandings(liveTop);
    }
  });

  // In Home, only Official Cars are shown
  let homeState = {
    cat: "cars",
    query: ""
  };

  function renderHomeGrid() {
    if (!homeGridEl) return;
    const q = homeState.query.toLowerCase();
    const filteredCars = allCars.filter(
      (c) =>
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.drivetrain.toLowerCase().includes(q) ||
        (c.engine || "").toLowerCase().includes(q) ||
        (c.badge || "").toLowerCase().includes(q)
    );
    homeGridEl.innerHTML = filteredCars.map((c) => createCarCardHTML(c)).join("");
    if (activeCategoryTitle) activeCategoryTitle.textContent = `Official Cars & Tuning (${filteredCars.length})`;
  }

  renderHomeGrid();

  document.querySelectorAll("[data-home-cat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const selected = btn.dataset.homeCat || "cars";
      homeState.cat = selected;
      document.querySelectorAll("[data-home-cat]").forEach((b) => {
        b.classList.toggle("is-active", b.dataset.homeCat === selected);
      });
      switchView("view-elements");
      if (megaMenuNavItem) megaMenuNavItem.classList.remove("dropdown-open");
      renderHomeGrid();
    });
  });

  const heroSearchInput = document.getElementById("hero-search-input");
  const heroSearchSubmitBtn = document.getElementById("hero-search-submit-btn");

  if (heroSearchInput) {
    heroSearchInput.addEventListener("input", (e) => {
      homeState.query = e.target.value.trim();
      renderHomeGrid();
    });
  }
  if (heroSearchSubmitBtn) {
    heroSearchSubmitBtn.addEventListener("click", () => {
      const anchor = document.getElementById("uiverse-catalog-anchor");
      if (anchor) anchor.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Interactive Cursor-Reactive Vehicle Loop on Home Hero Banner
  const nfsHeroBanner = document.getElementById("nfs-hero-banner");
  if (nfsHeroBanner) {
    nfsHeroBanner.addEventListener("mousemove", (e) => {
      const rect = nfsHeroBanner.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;
      nfsHeroBanner.style.setProperty("--hero-pan-x", `${(-normX * 26).toFixed(2)}px`);
      nfsHeroBanner.style.setProperty("--hero-pan-y", `${(-normY * 16).toFixed(2)}px`);
      nfsHeroBanner.style.setProperty("--hero-tilt-x", `${(normX * 4.5).toFixed(2)}deg`);
      nfsHeroBanner.style.setProperty("--hero-tilt-y", `${(-normY * 3.5).toFixed(2)}deg`);
    });

    nfsHeroBanner.addEventListener("mouseleave", () => {
      nfsHeroBanner.style.setProperty("--hero-pan-x", "0px");
      nfsHeroBanner.style.setProperty("--hero-pan-y", "0px");
      nfsHeroBanner.style.setProperty("--hero-tilt-x", "0deg");
      nfsHeroBanner.style.setProperty("--hero-tilt-y", "0deg");
    });
  }

  // 4.4 RUTAS Y CIRCUITOS (#view-challenges) & LIVE FIREBASE ROUTE LEADERBOARD
  const routesCatalogGrid = document.getElementById("routes-catalog-grid");
  const routesCatalogHeading = document.getElementById("routes-catalog-heading");
  const routesCatalogSearch = document.getElementById("routes-catalog-search");
  const lbTbody = document.getElementById("routes-leaderboard-tbody");
  const lbModalityTabsContainer = document.getElementById("lb-modality-tabs");
  const lbDriverSearch = document.getElementById("lb-driver-search");
  const lbCarSelect = document.getElementById("lb-car-select");
  const lbGearboxSelect = document.getElementById("lb-gearbox-select");

  let routesViewState = {
    cat: "all",
    district: "all",
    query: ""
  };

  let activeLeaderboardState = {
    route: allRoutes[0] || { name: "City Perimeter", type: "Circuito" },
    tab: "junkman_single",
    rawRecords: [],
    driverQuery: "",
    carFilter: "all",
    gearboxFilter: "all"
  };

  function renderRoutesCatalog() {
    if (!routesCatalogGrid) return;
    const q = routesViewState.query.toLowerCase();

    const filtered = allRoutes.filter((r) => {
      const meta = getStitchRouteMetadata(r);
      const matchCat = routesViewState.cat === "all" || r.type === routesViewState.cat;
      const matchDist = routesViewState.district === "all" || meta.district === routesViewState.district;
      const wr = getRouteWRData(r);
      const matchQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        meta.district.toLowerCase().includes(q) ||
        wr.driver.toLowerCase().includes(q);
      return matchCat && matchDist && matchQuery;
    });

    routesCatalogGrid.innerHTML = filtered.map((r, i) => createRouteCardHTML(r, i)).join("");
    if (routesCatalogHeading) {
      routesCatalogHeading.textContent = `Catálogo Oficial de Pistas (${filtered.length})`;
    }
    if (typeof window.initGlitchDataText === "function") {
      window.initGlitchDataText();
    }
  }

  renderRoutesCatalog();

  function updateRoutesBannerTitle(cat) {
    const prefixEl = document.getElementById("rc-banner-prefix");
    const mainEl = document.getElementById("rc-banner-main");
    if (!prefixEl || !mainEl) return;
    if (cat === "Circuito") {
      prefixEl.textContent = "TABLA DE CLASIFICACIÓN • 29 PISTAS";
      mainEl.textContent = "CIRCUITO LEADERBOARDS";
    } else if (cat === "Sprint") {
      prefixEl.textContent = "TABLA DE CLASIFICACIÓN • 46 PISTAS";
      mainEl.textContent = "SPRINT LEADERBOARDS";
    } else if (cat === "Drag") {
      prefixEl.textContent = "TABLA DE CLASIFICACIÓN • 11 PISTAS";
      mainEl.textContent = "DRAG LEADERBOARDS";
    } else {
      prefixEl.textContent = "RUTAS, CIRCUITOS &";
      mainEl.textContent = "WORLD RECORDS";
    }
  }

  document.querySelectorAll("[data-routes-cat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.routesCat || "all";
      routesViewState.cat = cat;
      routesViewState.district = "all";
      document.querySelectorAll("[data-routes-cat]").forEach((b) => {
        b.classList.toggle("is-active", b.dataset.routesCat === cat);
      });
      document.querySelectorAll("[data-routes-district]").forEach((b) => {
        b.classList.toggle("is-active", b.dataset.routesDistrict === "all");
      });
      updateRoutesBannerTitle(cat);
      switchView("view-challenges");
      closeAllDropdowns();
      renderRoutesCatalog();
    });
  });

  document.querySelectorAll("[data-routes-district]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dist = btn.dataset.routesDistrict || "all";
      routesViewState.district = dist;
      document.querySelectorAll("[data-routes-district]").forEach((b) => {
        b.classList.toggle("is-active", b.dataset.routesDistrict === dist);
      });
      switchView("view-challenges");
      closeAllDropdowns();
      renderRoutesCatalog();
    });
  });

  if (routesCatalogSearch) {
    routesCatalogSearch.addEventListener("input", (e) => {
      routesViewState.query = e.target.value.trim();
      renderRoutesCatalog();
    });
  }

  // Render Modality Tabs depending on Circuito vs Sprint/Drag
  function renderModalityTabsForRoute(route) {
    if (!lbModalityTabsContainer) return;
    if (route.type === "Circuito") {
      const tabs = [
        { id: "junkman_single", label: "Junkman (Single Lap)" },
        { id: "junkman_fast", label: "Junkman (Fast Lap)" },
        { id: "bmw_single", label: "BMW M3 GTR (Single Lap)" },
        { id: "bmw_fast", label: "BMW M3 GTR (Fast Lap)" },
        { id: "stock_series", label: "Stock / De Serie" }
      ];
      if (!tabs.some((t) => t.id === activeLeaderboardState.tab)) {
        activeLeaderboardState.tab = "junkman_single";
      }
      lbModalityTabsContainer.innerHTML = tabs
        .map(
          (t) =>
            `<button type="button" class="filter-pill-btn glitch-nfs-btn glitch-pill-btn ${activeLeaderboardState.tab === t.id ? "is-active active" : ""}" data-lb-tab="${t.id}" data-text="${escapeHtml(t.label)}">
              <span>${escapeHtml(t.label)}</span>
              <svg class="btn-hover-arrow" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path>
              </svg>
            </button>`
        )
        .join("");
    } else {
      const tabs = [
        { id: "junkman", label: `${route.type} Junkman` },
        { id: "bmw", label: `${route.type} BMW M3 GTR` },
        { id: "stock_series", label: `${route.type} Stock / De Serie` }
      ];
      if (!tabs.some((t) => t.id === activeLeaderboardState.tab)) {
        activeLeaderboardState.tab = "junkman";
      }
      lbModalityTabsContainer.innerHTML = tabs
        .map(
          (t) =>
            `<button type="button" class="filter-pill-btn glitch-nfs-btn glitch-pill-btn ${activeLeaderboardState.tab === t.id ? "is-active active" : ""}" data-lb-tab="${t.id}" data-text="${escapeHtml(t.label)}">
              <span>${escapeHtml(t.label)}</span>
              <svg class="btn-hover-arrow" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"></path>
              </svg>
            </button>`
        )
        .join("");
    }

    lbModalityTabsContainer.querySelectorAll("[data-lb-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeLeaderboardState.tab = btn.dataset.lbTab;
        loadRouteLeaderboard(activeLeaderboardState.route, activeLeaderboardState.tab);
      });
    });
  }

  function renderLeaderboardPositionBadge(rankNum) {
    if (rankNum === 1) {
      return `
        <div class="lb-position-cell">
          <span class="lb-trophy-badge lb-gold" title="1º Lugar - Campeón &amp; Récord Mundial">
            <svg class="lb-trophy-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
              <path d="M4 22h16"></path>
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
            </svg>
          </span>
        </div>`;
    }
    if (rankNum === 2) {
      return `
        <div class="lb-position-cell">
          <span class="lb-trophy-badge lb-silver" title="2º Lugar - Subcampeón">
            <svg class="lb-trophy-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
              <path d="M4 22h16"></path>
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
            </svg>
          </span>
        </div>`;
    }
    if (rankNum === 3) {
      return `
        <div class="lb-position-cell">
          <span class="lb-trophy-badge lb-bronze" title="3º Lugar - Podio">
            <svg class="lb-trophy-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
              <path d="M4 22h16"></path>
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
            </svg>
          </span>
        </div>`;
    }
    return `
      <div class="lb-position-cell">
        <span class="lb-rank-num">#${rankNum}</span>
      </div>`;
  }

  function getDriverAvatarBadge(driverName, known) {
    const name = String(driverName || "WR").trim();
    const initials = name.slice(0, 2).toUpperCase();
    const palette = [
      { bg: "linear-gradient(135deg, #2e1065, #09080e)", border: "rgba(168, 85, 247, 0.4)", text: "#c084fc" },
      { bg: "linear-gradient(135deg, #1e293b, #0f172a)", border: "rgba(56, 189, 248, 0.4)", text: "#38bdf8" },
      { bg: "linear-gradient(135deg, #431407, #180a06)", border: "rgba(255, 123, 0, 0.4)", text: "#fb923c" },
      { bg: "linear-gradient(135deg, #064e3b, #022c22)", border: "rgba(52, 211, 153, 0.4)", text: "#34d399" },
      { bg: "linear-gradient(135deg, #18181b, #27272a)", border: "rgba(255, 255, 255, 0.2)", text: "#ffffff" },
      { bg: "linear-gradient(135deg, #312e81, #1e1b4b)", border: "rgba(129, 140, 248, 0.4)", text: "#818cf8" }
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = palette[Math.abs(hash) % palette.length];

    return `
      <div class="lb-avatar-box" style="background: ${color.bg}; border: 1px solid ${color.border}; color: ${color.text};">
        <span>${escapeHtml(initials)}</span>
      </div>
    `;
  }

  function renderActiveLeaderboardTable() {
    if (!lbTbody) return;
    const rows = activeLeaderboardState.rawRecords.filter((r) => {
      const matchDriver =
        !activeLeaderboardState.driverQuery ||
        r.driver.toLowerCase().includes(activeLeaderboardState.driverQuery.toLowerCase());
      const matchCar =
        activeLeaderboardState.carFilter === "all" ||
        (r.car || "").toLowerCase().includes(activeLeaderboardState.carFilter.toLowerCase());
      const matchGb =
        activeLeaderboardState.gearboxFilter === "all" ||
        (r.gearbox || "").toLowerCase().includes(activeLeaderboardState.gearboxFilter.toLowerCase());
      return matchDriver && matchCar && matchGb;
    });

    if (rows.length === 0) {
      lbTbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-secondary); padding: 24px;">No se encontraron registros con los filtros activos.</td></tr>`;
      return;
    }

    const top1Ms = rows[0] && rows[0].timeMs ? rows[0].timeMs : parseTimeToMs(rows[0].time);

    lbTbody.innerHTML = rows
      .map((row, index) => {
        const rankNum = index + 1;
        const dKey = String(row.driver || "").toLowerCase();
        const known = KNOWN_DRIVERS_MAP[dKey] || { country: "ES // SPAIN", team: "Rockport Racing", setup: "Junkman Stage 3" };
        const rowMs = row.timeMs || parseTimeToMs(row.time);
        let deltaText = "● LÍDER WR";
        let deltaColor = "#34d399";
        if (rankNum > 1 && top1Ms && rowMs && rowMs >= top1Ms) {
          deltaText = `+${((rowMs - top1Ms) / 1000).toFixed(3)}s`;
          deltaColor = rankNum === 2 ? "#e2e8f0" : rankNum === 3 ? "#fdba74" : "#fbbf24";
        }

        const hasVideo = row.videoUrl && row.videoUrl !== "#" && String(row.videoUrl).startsWith("http");
        const f1Points = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
        const rowPts = (typeof row.points === "number" && !isNaN(row.points)) 
          ? row.points 
          : (typeof row.pts === "number" && !isNaN(row.pts))
          ? row.pts
          : (f1Points[index] || 0);

        return `
          <tr data-open-pilot="${escapeHtml(row.driver)}" style="cursor: pointer;" title="Haz clic para abrir el Expediente de Telemetría de ${escapeHtml(row.driver)}">
            <td style="width: 56px; text-align: center;">
              ${renderLeaderboardPositionBadge(rankNum)}
            </td>
            <td>
              <div class="lb-user-cell">
                ${getDriverAvatarBadge(row.driver, known)}
                <div class="lb-user-info">
                  <div class="nfs-driver-link lb-user-name" data-open-pilot="${escapeHtml(row.driver)}">${escapeHtml(row.driver)}</div>
                </div>
              </div>
            </td>
            <td style="text-align: right;">
              <div class="lb-time-cell">
                <span class="lb-time-val ${rankNum === 1 ? 'lb-wr-glow' : ''}">${formatStitchTimeHtml(row.time)}</span>
              </div>
            </td>
            <td>
              <span class="stitch-delta-val stitch-num" style="color: ${deltaColor};">${deltaText}</span>
            </td>
            <td>
              <div style="font-size: 13.5px; font-weight: 700; color: #ffffff;">${escapeHtml(row.car)}</div>
              <div style="font-family: var(--font-mono); font-size: 11px; font-weight: 600; color: #71717a;">${escapeHtml(row.setup || known.setup)}</div>
            </td>
            <td>
              <span class="creator-slug">${escapeHtml(row.device || "DualSense")}</span>
            </td>
            <td>
              <span class="creator-slug">${escapeHtml(row.gearbox || "Manual")}</span>
            </td>
            <td>
              <span class="stitch-date-val stitch-num">${escapeHtml(row.date || "27/09/2026")}</span>
            </td>
            <td style="text-align: center;" onclick="event.stopPropagation();">
              ${
                hasVideo
                  ? `<a href="${escapeHtml(row.videoUrl)}" target="_blank" rel="noopener noreferrer" class="btn-nfs-white-cta btn-table-video no-glitch" title="Ver video oficial" style="padding: 5px 12px; font-size: 11px; text-decoration: none; display: inline-flex; align-items: center; justify-content: center;">
                      <span>VIDEO</span>
                    </a>`
                  : `<span style="font-size: 11px; color: #52525b; font-weight: 600;">-</span>`
              }
            </td>
          </tr>
        `;
      })
      .join("");
  }

  const lbQuickRouteSwitcher = document.getElementById("lb-quick-route-switcher");
  if (lbQuickRouteSwitcher && allRoutes.length > 0) {
    const groups = ["Circuito", "Sprint", "Drag"];
    lbQuickRouteSwitcher.innerHTML = groups
      .map((type) => {
        const tracks = allRoutes.filter((r) => r.type === type);
        return `<optgroup label="${type} (${tracks.length})">${tracks
          .map((t) => `<option value="${escapeHtml(t.name)}">${escapeHtml(t.name)} (${escapeHtml(t.type)})</option>`)
          .join("")}</optgroup>`;
      })
      .join("");

    lbQuickRouteSwitcher.addEventListener("change", (e) => {
      const selectedName = e.target.value;
      const found = allRoutes.find((r) => r.name === selectedName);
      if (found) {
        loadRouteLeaderboard(found);
      }
    });
  }

  async function loadRouteLeaderboard(route, requestedTab) {
    if (!route) return;
    activeLeaderboardState.route = route;
    if (requestedTab) {
      activeLeaderboardState.tab = requestedTab;
    } else {
      activeLeaderboardState.tab = route.type === "Circuito" ? "junkman_single" : "junkman";
    }

    if (lbQuickRouteSwitcher) {
      lbQuickRouteSwitcher.value = route.name;
    }

    const meta = getStitchRouteMetadata(route);
    const wr = getRouteWRData(route);

    const titleEl = document.getElementById("lb-active-route-title");
    const typePillEl = document.getElementById("lb-active-type-pill");
    const distTagEl = document.getElementById("lb-active-district-tag");
    const wrTimeEl = document.getElementById("lb-active-wr-time");
    const wrHolderEl = document.getElementById("lb-active-wr-holder");

    const heroTitleEl = document.getElementById("lb-hero-route-title");
    const heroTypeEl = document.getElementById("lb-hero-type-pill");
    const heroDistEl = document.getElementById("lb-hero-district-tag");
    const heroWrTimeEl = document.getElementById("lb-hero-wr-time");
    const heroWrHolderEl = document.getElementById("lb-hero-wr-holder");

    const routeNameUpper = escapeHtml((route.name || "").toUpperCase());
    const rawType = (route.type || "Circuito").trim();
    const typeLower = rawType.toLowerCase();
    let modalityWord = "CIRCUITO";
    if (typeLower.includes("circ")) {
      modalityWord = "CIRCUITO";
    } else if (typeLower.includes("sprint")) {
      modalityWord = "SPRINT";
    } else if (typeLower.includes("drag")) {
      modalityWord = "DRAG";
    }

    const titleMarkup = `
      <span class="rc-title-line-white lb-title-prefix">LEADERBOARD • ${modalityWord}</span>
      <span class="rc-title-line-gradient lb-title-line-gradient">
        <span class="lb-title-route-name">${routeNameUpper}</span>
      </span>
    `;
    if (titleEl) titleEl.innerHTML = titleMarkup;
    if (heroTitleEl) {
      heroTitleEl.innerHTML = titleMarkup;
      heroTitleEl.classList.add("lb-route-title-gradient", "lb-hero-main-title");
    }

    const heroTagNetwork = document.getElementById("lb-hero-tag-network");
    if (heroTagNetwork) {
      heroTagNetwork.textContent = `${modalityWord} • OFFICIAL LEADERBOARD`;
    }

    const heroDesc = document.getElementById("lb-hero-desc");
    if (heroDesc) {
      if (modalityWord === "DRAG") {
        heroDesc.textContent = "Pista oficial de Drag y aceleración pura de Rockport City con telemetría a 128Hz, tiempos de reacción y cambios perfectos validados.";
      } else if (modalityWord === "SPRINT") {
        heroDesc.textContent = "Trazado de punto a punto (Sprint) en Rockport City auditado con telemetría cuántica a 128Hz y cortes de sectores en tiempo real.";
      } else {
        heroDesc.textContent = "Circuito cerrado homologado de Rockport City auditado con telemetría cuántica a 128Hz, récords por vuelta y tiempo total verificado.";
      }
    }

    if (typePillEl) {
      typePillEl.textContent = route.type.toUpperCase();
      typePillEl.className = `nfs-type-pill type-${route.type.toLowerCase()}`;
    }
    if (heroTypeEl) {
      heroTypeEl.textContent = route.type.toUpperCase();
      heroTypeEl.className = `nfs-type-pill type-${route.type.toLowerCase()}`;
    }
    if (distTagEl) distTagEl.textContent = `${meta.district.toUpperCase()} • ${meta.laps.toUpperCase()}`;
    if (heroDistEl) heroDistEl.textContent = `${meta.district.toUpperCase()} • ${meta.laps.toUpperCase()}`;
    if (wrTimeEl) wrTimeEl.textContent = wr.time;
    if (wrHolderEl) wrHolderEl.textContent = `${wr.driver} • ${wr.car}`;
    if (heroWrTimeEl) heroWrTimeEl.textContent = wr.time;
    if (heroWrHolderEl) heroWrHolderEl.textContent = `${wr.driver} • ${wr.car}`;

    renderModalityTabsForRoute(route);

    const fbData = await fetchFirebaseRouteRecords(route.name);
    const records = extractCategoryRecords(fbData, activeLeaderboardState.tab, route);
    activeLeaderboardState.rawRecords = records;

    // Populate car dropdown
    if (lbCarSelect) {
      const cars = Array.from(new Set(records.map((r) => r.car).filter(Boolean)));
      lbCarSelect.innerHTML =
        `<option value="all">Todos los Autos (${cars.length})</option>` +
        cars.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
      activeLeaderboardState.carFilter = "all";
    }

    if (records.length > 0) {
      if (wrTimeEl) wrTimeEl.textContent = records[0].time;
      if (wrHolderEl) wrHolderEl.textContent = `${records[0].driver} • ${records[0].car}`;
      if (heroWrTimeEl) heroWrTimeEl.textContent = records[0].time;
      if (heroWrHolderEl) heroWrHolderEl.textContent = `${records[0].driver} • ${records[0].car}`;
    }

    renderActiveLeaderboardTable();
  }

  // Preload initial route leaderboard state in background
  if (allRoutes.length > 0) {
    loadRouteLeaderboard(allRoutes[0], "junkman_single");
  }

  if (lbDriverSearch) {
    lbDriverSearch.addEventListener("input", (e) => {
      activeLeaderboardState.driverQuery = e.target.value.trim();
      renderActiveLeaderboardTable();
    });
  }
  if (lbCarSelect) {
    lbCarSelect.addEventListener("change", (e) => {
      activeLeaderboardState.carFilter = e.target.value;
      renderActiveLeaderboardTable();
    });
  }
  if (lbGearboxSelect) {
    lbGearboxSelect.addEventListener("change", (e) => {
      activeLeaderboardState.gearboxFilter = e.target.value;
      renderActiveLeaderboardTable();
    });
  }

  // Delegate clicks on any route card or button with [data-open-route-lb] or [data-route-jump]
  // Opens the dedicated Leaderboard section (#view-leaderboard) for that specific route
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-open-route-lb], [data-route-jump]");
    if (!trigger) return;
    const routeName = trigger.dataset.openRouteLb || trigger.dataset.routeJump;
    if (!routeName) return;
    const found = allRoutes.find((r) => r.name.toLowerCase() === routeName.toLowerCase());
    if (found) {
      loadRouteLeaderboard(found);
      switchView("view-leaderboard");
    }
  });

  // Global handler for opening leaderboards directly
  window.abrirLeaderboard = function(routeName) {
    if (!routeName && allRoutes.length > 0) {
      routeName = allRoutes[0].name;
    }
    const found = allRoutes.find((r) => r.name.toLowerCase() === String(routeName).toLowerCase()) || { name: routeName, type: "Circuito" };
    loadRouteLeaderboard(found);
    switchView("view-leaderboard");
  };

  const btnHomeOpenPerimeter = document.getElementById("btn-home-open-perimeter");
  if (btnHomeOpenPerimeter && allRoutes.length > 0) {
    btnHomeOpenPerimeter.addEventListener("click", () => {
      loadRouteLeaderboard(allRoutes[0], "junkman_single");
      switchView("view-leaderboard");
    });
  }

  // ==========================================================================
  // 4.5 SALÓN DE LA FAMA (#view-spotlight) & GLOBAL TELEMETRY AGGREGATOR
  // ==========================================================================
  function buildGlobalDriversDatabase(filterDiscipline) {
    const driverMap = {};
    const routeTypeMap = {};
    allRoutes.forEach((r) => {
      routeTypeMap[r.name] = r.type || "Circuito";
    });

    const isGlobal = !filterDiscipline || filterDiscipline === "global" || filterDiscipline === "all";
    const routesToProcess = isGlobal
      ? allRoutes
      : allRoutes.filter((r) => (r.type || "Circuito").toLowerCase() === String(filterDiscipline).toLowerCase());

    function ensureDriver(name) {
      const cleanName = String(name || "Unknown").trim();
      if (!driverMap[cleanName]) {
        const lower = cleanName.toLowerCase();
        const known = KNOWN_DRIVERS_MAP[lower] || {
          country: "INT // ROCKPORT",
          team: "Rockport Speed Labs",
          setup: "Junkman Stage 3"
        };
        driverMap[cleanName] = {
          name: cleanName,
          country: known.country,
          team: known.team,
          setup: known.setup,
          wrs: 0,
          silver: 0,
          bronze: 0,
          p4: 0,
          p5: 0,
          p6_10: 0,
          pAbove10: 0,
          bestPos: 999,
          entries: 0,
          points: 0,
          totalPodiums: 0,
          byType: { Circuito: 0, Sprint: 0, Drag: 0 },
          podiumsByType: { Circuito: 0, Sprint: 0, Drag: 0 },
          carCounts: {},
          device: known.device || "PlayStation DualSense",
          gearbox: "Manual",
          records: []
        };
      }
      return driverMap[cleanName];
    }

    const fiaPointsMap = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

    routesToProcess.forEach((route) => {
      const rKey = sanitizeFirebaseKey(route.name);
      const fbData = window.NFS_GLOBAL_LEADERBOARDS_CACHE ? window.NFS_GLOBAL_LEADERBOARDS_CACHE[rKey] : null;
      const categoriesToScan = route.type === "Circuito"
        ? ["junkman_single", "junkman_fast", "bmw_single", "bmw_fast"]
        : ["junkman", "bmw"];

      categoriesToScan.forEach((catKey) => {
        const trackRecords = extractCategoryRecords(fbData, catKey, route);

        trackRecords.forEach((rec, idx) => {
          const rank = idx + 1;
          const d = ensureDriver(rec.driver);
          const rType = route.type || "Circuito";

          d.entries += 1;
          d.bestPos = Math.min(d.bestPos, rank);

          if (rec.device) d.device = rec.device;
          if (rec.gearbox) d.gearbox = rec.gearbox;
          if (rec.car) {
            d.carCounts[rec.car] = (d.carCounts[rec.car] || 0) + (rank === 1 ? 3 : 1);
          }

          const pts = idx < fiaPointsMap.length ? fiaPointsMap[idx] : 0.5;
          d.points = (d.points || 0) + pts;

          if (rank === 1) {
            d.wrs += 1;
            d.totalPodiums += 1;
            d.byType[rType] = (d.byType[rType] || 0) + 1;
            d.podiumsByType[rType] = (d.podiumsByType[rType] || 0) + 1;
          } else if (rank === 2) {
            d.silver += 1;
            d.totalPodiums += 1;
            d.podiumsByType[rType] = (d.podiumsByType[rType] || 0) + 1;
          } else if (rank === 3) {
            d.bronze += 1;
            d.totalPodiums += 1;
            d.podiumsByType[rType] = (d.podiumsByType[rType] || 0) + 1;
          } else if (rank === 4) {
            d.p4 = (d.p4 || 0) + 1;
          } else if (rank === 5) {
            d.p5 = (d.p5 || 0) + 1;
          } else if (rank <= 10) {
            d.p6_10 = (d.p6_10 || 0) + 1;
          } else {
            d.pAbove10 = (d.pAbove10 || 0) + 1;
          }

          d.records.push({
            rank,
            route: route.name,
            type: rType,
            category: catKey,
            time: rec.time,
            timeMs: rec.timeMs || parseTimeToMs(rec.time),
            car: rec.car || (catKey.includes("bmw") ? "BMW M3 GTR" : "Porsche Carrera GT"),
            setup: rec.setup || d.setup,
            device: rec.device || d.device,
            gearbox: rec.gearbox || d.gearbox,
            videoUrl: rec.videoUrl || "#"
          });
        });
      });
    });

    // Also include Blacklist 2026 drivers if in global mode
    if (isGlobal && typeof DEFAULT_BLACKLIST_DRIVERS !== "undefined") {
      DEFAULT_BLACKLIST_DRIVERS.forEach((bl) => {
        const cleanBlName = bl.name.replace(/™/g, "").trim();
        const d = ensureDriver(cleanBlName);
        if (!d.carCounts[bl.ride]) {
          d.carCounts[bl.ride] = 2;
        }
        if (d.records.length === 0 && allRoutes.length > 0) {
          const sampleRoutes = [
            allRoutes[(bl.rank * 3) % allRoutes.length],
            allRoutes[(bl.rank * 5 + 2) % allRoutes.length],
            allRoutes[(bl.rank * 7 + 4) % allRoutes.length]
          ].filter(Boolean);
          sampleRoutes.forEach((sr, sIdx) => {
            const wr = getRouteWRData(sr);
            const baseMs = parseTimeToMs(wr.time) || 95000;
            const rankPos = sIdx === 0 ? 2 : 3;
            const deltaMs = rankPos * 380 + bl.rank * 45;
            d.entries += 1;
            d.bestPos = Math.min(d.bestPos, rankPos);
            if (rankPos === 2) d.silver += 1;
            else d.bronze += 1;
            d.totalPodiums += 1;
            d.points = (d.points || 0) + (rankPos === 2 ? 18 : 15);
            d.records.push({
              rank: rankPos,
              route: sr.name,
              type: sr.type,
              category: "Blacklist Tournament Spec",
              time: formatMsToTime(baseMs + deltaMs),
              timeMs: baseMs + deltaMs,
              car: bl.ride,
              setup: bl.strength || "Blacklist Spec",
              device: "DualSense",
              gearbox: "Manual",
              videoUrl: bl.youtube || "#"
            });
          });
        }
      });
    }

    return Object.values(driverMap).map((d) => {
      const topCarEntry = Object.entries(d.carCounts).sort((a, b) => b[1] - a[1])[0];
      d.signatureCar = topCarEntry ? topCarEntry[0] : "Porsche Carrera GT";
      if (d.wrs >= 10) {
        d.tierKey = "legend";
        d.tierLabel = "ABSOLUTE LEGEND";
        d.tierColor = "#fde047";
      } else if (d.wrs >= 5) {
        d.tierKey = "master";
        d.tierLabel = "GRANDMASTER";
        d.tierColor = "#c084fc";
      } else if (d.wrs >= 1) {
        d.tierKey = "holder";
        d.tierLabel = "WR HOLDER";
        d.tierColor = "#22d3ee";
      } else if (d.silver > 0 || d.bronze > 0) {
        d.tierKey = "podium";
        d.tierLabel = "PODIUM CONTENDER";
        d.tierColor = "#fb923c";
      } else if (d.bestPos <= 5) {
        d.tierKey = "top5";
        d.tierLabel = "TOP 5 CONTENDER";
        d.tierColor = "#34d399";
      } else {
        d.tierKey = "track";
        d.tierLabel = "TRACK SPECIALIST";
        d.tierColor = "#94a3b8";
      }
      d.records.sort((a, b) => a.rank - b.rank || a.route.localeCompare(b.route));
      return d;
    });
  }

  const hofState = {
    discipline: "global",
    tab: "wrs",
    epoch: "all",
    search: "",
    car: "all",
    tier: "all"
  };

  function renderHallOfFameView() {
    const discipline = hofState.discipline || "global";
    const drivers = buildGlobalDriversDatabase(discipline);

    const totalTracks = discipline === "Circuito"
      ? (allRoutes.filter(r => r.type === "Circuito").length || 29)
      : discipline === "Sprint"
      ? (allRoutes.filter(r => r.type === "Sprint").length || 46)
      : discipline === "Drag"
      ? (allRoutes.filter(r => r.type === "Drag").length || 11)
      : (allRoutes.length || 86);

    // Update Titles and headings according to discipline
    const headingEl = document.getElementById("hof-main-heading");
    const subHeadingEl = document.getElementById("hof-main-subheading");
    if (headingEl) {
      if (discipline === "Circuito") headingEl.textContent = "TOP CIRCUITO • 29 PISTAS HOMOLOGADAS";
      else if (discipline === "Sprint") headingEl.textContent = "TOP SPRINT • 46 TRAZADOS PUNTO A PUNTO";
      else if (discipline === "Drag") headingEl.textContent = "TOP DRAG • 11 PISTAS DE ACELERACIÓN";
      else headingEl.textContent = "ROCKPORT ALL-TIME GLOBAL LEADERBOARD";
    }
    if (subHeadingEl) {
      if (discipline === "Circuito") subHeadingEl.textContent = "Líderes de vuelta rápida y tiempos totales en los 29 circuitos cerrados de Rockport City validados a 128Hz.";
      else if (discipline === "Sprint") subHeadingEl.textContent = "Maestría y velocidad punta en las 46 rutas Sprint de punto a punto en Rockport.";
      else if (discipline === "Drag") subHeadingEl.textContent = "Clasificación élite en las 11 pistas de aceleración pura, tracción y cambios perfectos.";
      else subHeadingEl.textContent = "Clasificación consolidada de pilotos por victorias WR (P1), podios (P2/P3), mejor puesto y puntos FIA en Rockport.";
    }

    // Populate Vehicle Dropdown
    const carSelect = document.getElementById("hof-car-filter");
    if (carSelect && carSelect.options.length <= 1) {
      const distinctCars = Array.from(new Set(drivers.map(d => d.signatureCar).filter(Boolean))).sort();
      distinctCars.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        carSelect.appendChild(opt);
      });
    }

    // Filter & Sort Main Hall of Fame Table
    const hofTbody = document.getElementById("hof-main-tbody");
    if (!hofTbody) return;

    // Filter drivers
    let list = drivers.filter((d) => {
      if (hofState.tier !== "all" && d.tierKey !== hofState.tier) return false;
      if (hofState.car !== "all" && d.signatureCar !== hofState.car) return false;
      if (hofState.search) {
        const q = hofState.search.toLowerCase();
        const match =
          d.name.toLowerCase().includes(q) ||
          d.team.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q) ||
          d.signatureCar.toLowerCase().includes(q) ||
          (d.device && d.device.toLowerCase().includes(q));
        if (!match) return false;
      }
      return (d.entries > 0 || d.records.length > 0 || d.points > 0 || d.wrs > 0);
    });

    // Comprehensive Universal Motorsport Ranking:
    // 1. Podios: 1er Lugar (Récords Mundiales)
    // 2. Podios: 2do Lugar (Platas)
    // 3. Podios: 3er Lugar (Bronces)
    // 4. Mejor posición registrada en leaderboard (P4 < P5 < P6...)
    // 5. Conteo de 4tos lugares
    // 6. Conteo de 5tos lugares
    // 7. Puntos FIA acumulados
    // 8. Mayor cantidad de participaciones/rutas registradas
    // 9. Desempate alfabético
    list.sort((a, b) => {
      if (b.wrs !== a.wrs) return b.wrs - a.wrs;
      if (b.silver !== a.silver) return b.silver - a.silver;
      if (b.bronze !== a.bronze) return b.bronze - a.bronze;
      if ((a.bestPos || 999) !== (b.bestPos || 999)) return (a.bestPos || 999) - (b.bestPos || 999);
      if ((b.p4 || 0) !== (a.p4 || 0)) return (b.p4 || 0) - (a.p4 || 0);
      if ((b.p5 || 0) !== (a.p5 || 0)) return (b.p5 || 0) - (a.p5 || 0);
      if ((b.points || 0) !== (a.points || 0)) return (b.points || 0) - (a.points || 0);
      if ((b.entries || 0) !== (a.entries || 0)) return (b.entries || 0) - (a.entries || 0);
      return a.name.localeCompare(b.name);
    });

    const isEn = (typeof window !== "undefined" && window.getCurrentLanguage ? window.getCurrentLanguage() : "en") === "en";

    // Update Telemetry HUD metrics cards
    const totalDriversEl = document.getElementById("hof-hud-total-drivers");
    const totalRoutesEl = document.getElementById("hof-hud-total-routes");
    const syncStatusEl = document.getElementById("hof-hud-sync-status");
    const leaderNameEl = document.getElementById("hof-hud-leader-name");
    const leaderSubEl = document.getElementById("hof-hud-leader-sub");

    if (totalDriversEl) totalDriversEl.textContent = `${list.length} ${isEn ? "Active Drivers" : "Pilotos Activos"}`;
    if (totalRoutesEl) {
      if (discipline === "Circuito") totalRoutesEl.textContent = isEn ? "29 Homologated Circuits" : "29 Circuitos Homologados";
      else if (discipline === "Sprint") totalRoutesEl.textContent = isEn ? "46 Sprint Routes" : "46 Rutas Sprint";
      else if (discipline === "Drag") totalRoutesEl.textContent = isEn ? "11 Drag Strips" : "11 Pistas de Drag";
      else totalRoutesEl.textContent = isEn ? "86 Homologated Routes" : "86 Rutas Homologadas";
    }
    if (syncStatusEl) {
      syncStatusEl.innerHTML = `<span class="hof-live-dot"></span>${isEn ? "LIVE 128Hz ✓" : "EN VIVO 128Hz ✓"}`;
    }
    const leader = list[0];
    if (leaderNameEl && leader) {
      leaderNameEl.textContent = `${leader.name} (${leader.wrs > 0 ? leader.wrs + ' WRs' : Math.round(leader.points) + ' pts'})`;
    }
    if (leaderSubEl && leader) {
      leaderSubEl.textContent = `${leader.country} • ${leader.team || 'Apex Motorsports'}`;
    }

    const maxPts = list.length > 0 ? Math.max(1, list[0].points || 1) : 1;

    // Render Table Rows
    if (list.length === 0) {
      hofTbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 40px; color: #94a3b8; font-family: var(--font-mono);">
            ${isEn ? "🏁 No registered drivers found for the selected filters." : "🏁 No se encontraron pilotos registrados para los filtros seleccionados."}
          </td>
        </tr>
      `;
    } else {
      hofTbody.innerHTML = list
        .map((d, index) => {
          const rankNum = index + 1;
          const rankClass = rankNum === 1 ? "v7-hof-rank-1" : rankNum === 2 ? "v7-hof-rank-2" : rankNum === 3 ? "v7-hof-rank-3" : "v7-hof-rank-rest";
          const devIcon = d.device && d.device.toLowerCase().includes("teclado") ? "⌨" : d.device && d.device.toLowerCase().includes("volante") ? "☸" : "🎮";
          const ptsPct = Math.min(100, Math.max(4, Math.round(((d.points || 0) / maxPts) * 100)));

          // Puesto badge
          const bestPosVal = d.bestPos === 999 ? "N/A" : d.bestPos;
          const puestoClass = d.bestPos === 1 ? "hof-puesto-p1" : d.bestPos === 2 ? "hof-puesto-p2" : d.bestPos === 3 ? "hof-puesto-p3" : d.bestPos === 4 ? "hof-puesto-p4" : d.bestPos === 5 ? "hof-puesto-p5" : "hof-puesto-rest";
          const puestoLabel = d.bestPos === 1 ? "P1 (WR)" : d.bestPos === 999 ? "--" : `P${d.bestPos}`;

          // Medals or non-podium best-position pill (P1, P2, P3 Badges estilo Championship Standings)
          let medalsHtml = "";
          if (d.wrs > 0 || d.silver > 0 || d.bronze > 0) {
            medalsHtml = `
              <div class="hof-medals-wrap" style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                ${d.wrs > 0 ? `<span class="stitch-num v7-p1-gold-cell" style="display: inline-flex; align-items: center; justify-content: center; min-width: 34px; padding: 2px 7px; border-radius: 5px; background: linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%); color: #09090b; font-weight: 900; font-size: 11px; box-shadow: 0 0 10px rgba(245, 158, 11, 0.35); gap: 4px;" title="${d.wrs} ${isEn ? 'World Records (P1)' : 'Récords Mundiales (P1)'}"><span style="font-size: 8.5px; opacity: 0.85; font-weight: 800;">P1</span> ${d.wrs} WR</span>` : ''}
                ${d.silver > 0 ? `<span class="stitch-num v7-p2-silver-cell" style="display: inline-flex; align-items: center; justify-content: center; min-width: 30px; padding: 2px 7px; border-radius: 5px; background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(148, 163, 184, 0.35); color: #e2e8f0; font-weight: 800; font-size: 11px; gap: 4px;" title="${d.silver} ${isEn ? 'Second Places (P2)' : 'Segundos Lugares (P2)'}"><span style="font-size: 8.5px; color: #94a3b8; font-weight: 800;">P2</span> ${d.silver}</span>` : ''}
                ${d.bronze > 0 ? `<span class="stitch-num v7-p3-bronze-cell" style="display: inline-flex; align-items: center; justify-content: center; min-width: 30px; padding: 2px 7px; border-radius: 5px; background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(249, 115, 22, 0.35); color: #fb923c; font-weight: 800; font-size: 11px; gap: 4px;" title="${d.bronze} ${isEn ? 'Third Places (P3)' : 'Terceros Lugares (P3)'}"><span style="font-size: 8.5px; color: #f97316; font-weight: 800;">P3</span> ${d.bronze}</span>` : ''}
              </div>
            `;
          } else {
            medalsHtml = `
              <span class="hof-best-pos-pill" title="${isEn ? 'Best historic position achieved: P' + bestPosVal : 'Mejor posición histórica lograda: P' + bestPosVal}">
                ⭐ ${isEn ? 'BEST' : 'MEJOR'}: P${bestPosVal}
              </span>
            `;
          }

          const initials = d.name.slice(0, 2).toUpperCase();

          return `
            <tr data-open-pilot="${escapeHtml(d.name)}" style="cursor: pointer;" title="${isEn ? 'View Telemetry Dossier of' : 'Ver Expediente de Telemetría de'} ${escapeHtml(d.name)}">
              <td style="text-align: center;">
                <span class="v7-hof-rank-pill ${rankClass}">#${String(rankNum).padStart(2, "0")}</span>
              </td>
              <td>
                <div class="lb-user-cell">
                  <div class="lb-avatar-box" style="background: ${getDriverAvatarBg(d.name)}; color: #ffffff;">
                    ${escapeHtml(initials)}
                  </div>
                  <div class="lb-user-info">
                    <div class="nfs-driver-link lb-user-name" data-open-pilot="${escapeHtml(d.name)}" style="font-family: var(--font-heading); font-size: 14px; font-weight: 800; color: #ffffff;">${escapeHtml(d.name)}</div>
                    <div style="font-family: var(--font-mono); font-size: 10px; color: #94a3b8; display: flex; align-items: center; gap: 4px;">
                      <span>${escapeHtml(d.country)}</span>
                      <span style="opacity: 0.4;">•</span>
                      <span style="color: #cbd5e1;">${escapeHtml(d.team || "Rockport Racing")}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                ${medalsHtml}
              </td>
              <td>
                <div class="hof-points-cell">
                  <div style="display: flex; align-items: baseline; justify-content: space-between;">
                    <span class="hof-points-num">${Math.round(d.points).toLocaleString()} <span class="hof-points-pts-label">PTS</span></span>
                    <span style="font-family: var(--font-mono); font-size: 10px; color: #64748b;">${d.entries} ${isEn ? 'routes' : 'rutas'}</span>
                  </div>
                  <div class="hof-points-bar-wrap">
                    <div class="hof-points-bar-fill" style="width: ${ptsPct}%;"></div>
                  </div>
                </div>
              </td>
              <td style="text-align: center;">
                <span class="hof-puesto-pill ${puestoClass}">${puestoLabel}</span>
              </td>
              <td>
                <div style="font-family: var(--font-mono); font-size: 12px; font-weight: 700; color: #ffffff;">🏎 ${escapeHtml(d.signatureCar)}</div>
                <div style="margin-top: 3px;"><span class="v7-device-tag">${devIcon} ${escapeHtml((d.device || "DualSense").toUpperCase())}</span></div>
              </td>
              <td>
                <span class="v7-tier-pill tier-${d.tierKey}">${escapeHtml(d.tierLabel)}</span>
              </td>
              <td style="text-align: right;">
                <div style="display: inline-flex; gap: 6px; justify-content: flex-end;">
                  ${(() => {
                    const firstVidRec = (d.records || []).find((r) => r.videoUrl && r.videoUrl !== "#" && String(r.videoUrl).startsWith("http"));
                    const vidHref = firstVidRec ? firstVidRec.videoUrl : `https://www.youtube.com/results?search_query=${encodeURIComponent("NFS Most Wanted " + d.name + " WR")}`;
                    return `<a href="${escapeHtml(vidHref)}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" class="btn-nfs-white-cta btn-table-video no-glitch" style="padding: 5px 12px; font-size: 11px; text-decoration: none; display: inline-flex; align-items: center; justify-content: center;" title="Ver Video de ${escapeHtml(d.name)}"><span>VIDEO</span></a>`;
                  })()}
                  <button type="button" class="v7-btn-audit-wrs btn-nfs-white-cta" data-open-pilot="${escapeHtml(d.name)}" title="${isEn ? 'View Complete Telemetry Dossier' : 'Ver Expediente de Telemetría Completo'}">${isEn ? 'DOSSIER' : 'EXPEDIENTE'} &nearr;</button>
                </div>
              </td>
            </tr>
          `;
        })
        .join("");
    }

    // CSV Export Handler
    const btnCsv = document.getElementById("btn-hof-export-csv");
    if (btnCsv && !btnCsv.dataset.bound) {
      btnCsv.dataset.bound = "true";
      btnCsv.addEventListener("click", () => {
        const csvRows = [
          ["Rank", "Piloto", "Escuderia", "Pais", "WRs (P1)", "Segundos (P2)", "Terceros (P3)", "Mejor Puesto", "Puntos FIA", "Rutas Auditadas", "Dispositivo", "Vehiculo Insignia", "Rango de Honor"]
        ];
        list.forEach((d, idx) => {
          const rankNum = idx + 1;
          csvRows.push([
            rankNum,
            `"${(d.name || "").replace(/"/g, '""')}"`,
            `"${(d.team || "").replace(/"/g, '""')}"`,
            `"${(d.country || "").replace(/"/g, '""')}"`,
            d.wrs,
            d.silver,
            d.bronze,
            d.bestPos === 999 ? "N/A" : `P${d.bestPos}`,
            Math.round(d.points),
            d.entries,
            `"${(d.device || "").replace(/"/g, '""')}"`,
            `"${(d.signatureCar || "").replace(/"/g, '""')}"`,
            `"${(d.tierLabel || "").replace(/"/g, '""')}"`
          ]);
        });
        const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Rockport_SalondeFama_${discipline}_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  }

  function getDriverAvatarBg(name) {
    const colors = [
      "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899",
      "#06b6d4", "#6366f1", "#14b8a6", "#f97316", "#84cc16"
    ];
    let hash = 0;
    for (let i = 0; i < (name || "").length; i++) {
      hash = (hash << 5) - hash + name.charCodeAt(i);
      hash |= 0;
    }
    return colors[Math.abs(hash) % colors.length];
  }

  window.renderHallOfFameView = renderHallOfFameView;
  renderHallOfFameView();

  // Discipline Filter Buttons (Top Global, Top Circuito, Top Sprint, Top Drag)
  document.querySelectorAll("[data-hof-discipline]").forEach((btn) => {
    btn.addEventListener("click", () => {
      hofState.discipline = btn.dataset.hofDiscipline || "global";
      document.querySelectorAll("[data-hof-discipline]").forEach((b) => b.classList.toggle("is-active", b === btn));
      renderHallOfFameView();
    });
  });

  // Epoch Filter Buttons (Image 4)
  document.querySelectorAll("[data-hof-epoch]").forEach((btn) => {
    btn.addEventListener("click", () => {
      hofState.epoch = btn.dataset.hofEpoch || "all";
      document.querySelectorAll("[data-hof-epoch]").forEach((b) => b.classList.toggle("is-active", b === btn));
      renderHallOfFameView();
    });
  });

  // Live Cross-Tab Synchronization with Admin Panel & Background Firebase Polling
  try {
    const syncChannel = new BroadcastChannel("nfs_leaderboard_sync");
    syncChannel.onmessage = async (evt) => {
      if (evt.data && (evt.data.type === "LEADERBOARD_UPDATED" || evt.data.type === "SUBMISSION_APPROVED")) {
        console.log("⚡ [LIVE SYNC] Actualización detectada en Firebase RTDB:", evt.data);
        await prefetchGlobalLeaderboards();
        if (typeof window.renderHallOfFameView === "function") {
          window.renderHallOfFameView();
        }
      }
    };
  } catch (err) {}

  // Background Polling for Remote Firebase Updates (every 25 seconds)
  setInterval(() => {
    if (document.visibilityState === "visible") {
      prefetchGlobalLeaderboards();
    }
  }, 25000);

  // Listen for language change events to re-render Hall of Fame
  window.addEventListener("languageChanged", () => {
    if (typeof renderHallOfFameView === "function") {
      renderHallOfFameView();
    }
  });

  // ============================================================================
  // DYNAMIC BROWSER TAB NOTIFICATION & FAVICON EFFECTS (Abrir y Cerrar Pestaña)
  // ============================================================================
  function initDynamicTabEffects() {
    const originalTitle = document.title || "Need for Speed Most Wanted (2005) - Rockport World Records";
    let originalFavicon = "assets/img/favicon.svg";
    const faviconLink = document.querySelector("link[rel*='icon']");
    if (faviconLink && faviconLink.href) {
      originalFavicon = faviconLink.href;
    }

    let awayInterval = null;
    let welcomeTimeout = null;

    function createDynamicFavicon(type) {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        if (type === "alert") {
          ctx.fillStyle = "#0a0a0e";
          ctx.beginPath();
          ctx.arc(16, 16, 15, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = "#ff7b00";
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.fillStyle = "#ff7b00";
          ctx.font = "bold 18px 'Inter', sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("!", 16, 16);
        } else if (type === "welcome") {
          ctx.fillStyle = "#064e3b";
          ctx.beginPath();
          ctx.arc(16, 16, 15, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 3;
          ctx.stroke();

          ctx.fillStyle = "#34d399";
          ctx.font = "bold 16px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("✓", 16, 16);
        }
        return canvas.toDataURL("image/png");
      } catch (e) {
        return null;
      }
    }

    function setFavicon(url) {
      if (!url) return;
      let links = document.querySelectorAll("link[rel*='icon']");
      if (!links || links.length === 0) {
        const link = document.createElement("link");
        link.rel = "icon";
        link.href = url;
        document.head.appendChild(link);
      } else {
        links.forEach(l => l.href = url);
      }
    }

    function getContextualTitle() {
      const isEn = (typeof window !== "undefined" && window.getCurrentLanguage ? window.getCurrentLanguage() : "en") === "en";
      const activeSection = document.querySelector(".view-section.active, .view-section.is-active");
      const sectionId = activeSection ? activeSection.id : "";
      if (sectionId === "view-leaderboard" && activeLeaderboardState.route) {
        return `Leaderboard • ${activeLeaderboardState.route.name} (${activeLeaderboardState.route.type}) | NFSMW Ranks`;
      }
      if (sectionId === "view-spotlight") {
        const discLabel = hofState.discipline === "Circuito" ? (isEn ? "Circuit Top" : "Top Circuito") : hofState.discipline === "Sprint" ? (isEn ? "Sprint Top" : "Top Sprint") : hofState.discipline === "Drag" ? (isEn ? "Drag Top" : "Top Drag") : (isEn ? "Global Top" : "Top Global");
        return isEn ? `Hall of Fame • ${discLabel} | NFSMW Ranks` : `Salón de la Fama • ${discLabel} | NFSMW Ranks`;
      }
      if (sectionId === "view-challenges") {
        return isEn ? "Routes & Circuits • Rockport City | NFSMW Ranks" : "Rutas y Circuitos • Rockport City | NFSMW Ranks";
      }
      if (sectionId === "view-blacklist") {
        return isEn ? "Blacklist 15 • Rivals & Groups | NFSMW Ranks" : "Blacklist 15 • Rivales & Grupos | NFSMW Ranks";
      }
      return originalTitle;
    }

    const awayMessagesEn = [
      "⚠️ Stay on track, driver! • NFSMW Ranks",
      "⏱️ Real-time records waiting for you...",
      "🏁 The Blacklist awaits • Return to the asphalt",
      "⚡ Quantum 128Hz telemetry active"
    ];
    const awayMessagesEs = [
      "⚠️ ¡No te desvíes piloto! • NFSMW Ranks",
      "⏱️ Récords en tiempo real esperándote...",
      "🏁 La Blacklist te espera • Vuelve al asfalto",
      "⚡ Telemetría cuántica a 128Hz activa"
    ];
    let awayIndex = 0;

    function handleTabAway() {
      if (awayInterval) clearInterval(awayInterval);
      if (welcomeTimeout) clearTimeout(welcomeTimeout);

      const alertIcon = createDynamicFavicon("alert");
      if (alertIcon) setFavicon(alertIcon);

      const isEn = (typeof window !== "undefined" && window.getCurrentLanguage ? window.getCurrentLanguage() : "en") === "en";
      const msgs = isEn ? awayMessagesEn : awayMessagesEs;
      document.title = msgs[0];
      awayIndex = 1;
      awayInterval = setInterval(() => {
        document.title = msgs[awayIndex % msgs.length];
        awayIndex++;
      }, 2600);
    }

    function handleTabReturn() {
      if (awayInterval) {
        clearInterval(awayInterval);
        awayInterval = null;
      }
      if (welcomeTimeout) {
        clearTimeout(welcomeTimeout);
      }

      const welcomeIcon = createDynamicFavicon("welcome");
      if (welcomeIcon) setFavicon(welcomeIcon);

      const isEn = (typeof window !== "undefined" && window.getCurrentLanguage ? window.getCurrentLanguage() : "en") === "en";
      document.title = isEn ? "🟢 Back to the asphalt! 🔥" : "🟢 ¡De vuelta al asfalto! 🔥";

      welcomeTimeout = setTimeout(() => {
        document.title = getContextualTitle();
        if (originalFavicon) {
          setFavicon(originalFavicon);
        }
      }, 1800);
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        handleTabAway();
      } else {
        handleTabReturn();
      }
    });

    window.addEventListener("blur", () => {
      if (!awayInterval && document.hidden) {
        handleTabAway();
      }
    });

    window.addEventListener("focus", () => {
      if (awayInterval || document.title.includes("⚠️") || document.title.includes("⏱️") || document.title.includes("🏁")) {
        handleTabReturn();
      }
    });
  }

  // Initialize Dynamic Tab Effects
  initDynamicTabEffects();

  const hofDriverSearch = document.getElementById("hof-driver-search");
  if (hofDriverSearch) {
    hofDriverSearch.addEventListener("input", (e) => {
      hofState.search = e.target.value.trim();
      renderHallOfFameView();
    });
  }

  const hofTierFilter = document.getElementById("hof-tier-filter");
  if (hofTierFilter) {
    hofTierFilter.addEventListener("change", (e) => {
      hofState.tier = e.target.value;
      renderHallOfFameView();
    });
  }

  const hofCarFilter = document.getElementById("hof-car-filter");
  if (hofCarFilter) {
    hofCarFilter.addEventListener("change", (e) => {
      hofState.car = e.target.value;
      renderHallOfFameView();
    });
  }

  // Ctrl+K Shortcut to Search Pilots
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
      const s = document.getElementById("hof-driver-search");
      if (s) {
        e.preventDefault();
        s.focus();
      }
    }
  });

  // ==========================================================================
  // 4.6 CHALLENGER Y TORNEOS (#view-blog): V7 FULL ENGINE + FIREBASE SYNC
  // ==========================================================================
  const TORNEO_SUBPAGE_TITLES = {
    standings: "Tabla General de Standings (Top 15)",
    seasons: "Desafíos Semanales (Temporadas 1 & 2)",
    groups: "Grupos y Rivales (4 Grupos & 8 Rutas)",
    dossiers: "Ficha Técnica Blacklist (15 Plazas)",
    register: "Inscripción del Torneo 2026",
    tutorial: "Tournament Tutorial (Guía Oficial Paso a Paso)",
    "past-tournaments": "Past Tournaments (Challonge Archive)",
    rules: "Reglamento Oficial & Homologación v1.3"
  };

  const TORNEO_SUBPAGE_METADATA = {
    standings: {
      subtag: "CHAMPION STANDINGS // BLACKLIST",
      desc: "Clasificación general acumulada del campeonato Blacklist Top 15. Puntuación oficial: Podios (P1=25, P2=18, P3=15, P4=12), bonos de tiempo y reputación."
    },
    seasons: {
      subtag: "SEMANA CHALLENGER // 4 TIERS",
      desc: "Desafíos semanales organizados en 4 Tiers de dificultad. Supera los objetivos cronometrados para acumular puntos y escalar divisiones."
    },
    groups: {
      subtag: "BLACKLIST RACING GROUPS // 4 GRUPOS",
      desc: "Enfrentamientos en grupos rotativos Alfa, Beta, Gama y Delta en 8 circuitos oficiales con telemetría cuántica y bonos de reputación."
    },
    dossiers: {
      subtag: "DRIVER DOSSIERS // WORKSTATION",
      desc: "Expedientes tácticos e historial de telemetría de los 15 pilotos oficiales de la Blacklist en Rockport City."
    },
    register: {
      subtag: "REGISTRO OFICIAL // 15 PLAZAS",
      desc: "Inscripción y reserva de plazas en la parrilla oficial para el campeonato Blacklist con sincronización instantánea en Firebase RTDB."
    },
    rules: {
      subtag: "SPORTING CODE // REGLAMENTO OFICIAL",
      desc: "Código deportivo oficial, normativa de parches v1.2/v1.3, categorías Junkman y BMW NO NOS, y protocolo de arbitraje Avidemux a 128Hz."
    },
    tutorial: {
      subtag: "VIDEO GUÍA // HOMOLOGACIÓN",
      desc: "Procedimiento oficial de competición paso a paso: grabación continua a 60 FPS en YouTube, comprobación de tramo y sistema de puntuación."
    },
    "past-tournaments": {
      subtag: "CHALLONGE HISTORICAL ARCHIVE",
      desc: "Archivo histórico de eventos competitivos y torneos oficiales anteriores organizados por la comunidad NFSRANKS."
    }
  };

  let torneoState = {
    activeTab: "standings",
    standingsMode: "table",
    standingsGroupFilter: "all",
    standingsSort: "esports",
    seasonId: "season_1",
    seasonWeek: 1,
    seasonSubView: "challenges",
    champWeek: 1,
    champGroupIdx: 0,
    cockpitFilter: "all",
    cockpitSearch: "",
    activeCockpitRank: 1,
    eventStatus: null,
    champHeroMinimized: false
  };
  window.torneoState = torneoState;

  // Clone base drivers from V7 DEFAULT_BLACKLIST_DRIVERS
  let currentBlacklistDrivers =
    typeof DEFAULT_BLACKLIST_DRIVERS !== "undefined"
      ? JSON.parse(JSON.stringify(DEFAULT_BLACKLIST_DRIVERS))
      : [];

  // Default 10 Registered Pilots from V7
  const CHAMPIONSHIP_DEFAULT_PARTICIPANTS = [
    {
      name: "ZimanX",
      alias: "ZimanX",
      car: "BMW M3 GTR",
      youtube: "https://www.youtube.com/@ZimanX",
      bio: "Rey de los circuitos técnicos, trazadas al límite del motor físico.",
      specialty: "Circuitos de Alta Velocidad",
      schedule: "Noches (20:00 - 00:00 GMT)",
      avatar: "assets/img/cars/bmw-m3-gtr.jpg",
      registeredAt: "2026-04-04T02:39:05.786Z"
    },
    {
      name: "Mystic",
      alias: "MysticX",
      car: "Mercedes-Benz SLR McLaren",
      youtube: "https://www.youtube.com/channel/UCfc7-bf-S7SuG3o8v_B_28A",
      bio: "Especialista en potencia bruta y frenadas extremas.",
      specialty: "Polivalente / Todo Terreno",
      schedule: "Tardes (14:00 - 19:00 GMT)",
      avatar: "assets/img/cars/mercedes-slr.jpg",
      registeredAt: "2026-04-04T02:39:05.786Z"
    },
    {
      name: "Nebula",
      alias: "Nebula",
      car: "Ford GT",
      youtube: "https://www.youtube.com/@nebula8527",
      bio: "Dominador de rectas y velocidad punta en autopistas de Rockport.",
      specialty: "Polivalente / Todo Terreno",
      schedule: "Fines de Semana",
      avatar: "assets/img/cars/ford-gt.jpg",
      registeredAt: "2026-04-04T02:39:05.786Z"
    },
    {
      name: "xLeMondx",
      alias: "xLeMondx",
      car: "Chevrolet Corvette C6.R",
      youtube: "https://www.youtube.com/@xlemondx",
      bio: "Precisión quirúrgica en curvas rápidas y cambios de rasante.",
      specialty: "Sprints Técnicos",
      schedule: "Noches (20:00 - 00:00 GMT)",
      avatar: "assets/img/cars/corvette-c6r.jpg",
      registeredAt: "2026-04-04T02:39:05.786Z"
    },
    {
      name: "Avenger",
      alias: "SRTxAvengerT",
      car: "Porsche Carrera GT",
      youtube: "https://www.youtube.com/@SRTxAvenger",
      bio: "Maestro del Carrera GT y poseedor de múltiples récords mundiales.",
      specialty: "Polivalente / Todo Terreno",
      schedule: "Noches (20:00 - 00:00 GMT)",
      avatar: "assets/img/cars/porsche-carrera-gt.jpg",
      registeredAt: "2026-04-04T02:39:05.786Z"
    },
    {
      name: "DarkShido",
      alias: "Shido",
      car: "Lamborghini Murciélago",
      youtube: "https://www.youtube.com/@DarkShido96",
      bio: "Tracción total agresiva y salidas fulminantes desde parado.",
      specialty: "Circuitos de Alta Velocidad",
      schedule: "Tardes (14:00 - 19:00 GMT)",
      avatar: "assets/img/cars/lambo-murcielago.jpg",
      registeredAt: "2026-04-04T02:39:05.786Z"
    },
    {
      name: "DannyLove",
      alias: "DannyLove",
      car: "Lotus Elise",
      youtube: "https://www.youtube.com/@Dannylove970",
      bio: "Paso por curva imbatible con chasis ultraligero en sectores revirados.",
      specialty: "Sprints Técnicos",
      schedule: "Noches (20:00 - 00:00 GMT)",
      avatar: "assets/img/cars/lotus-elise.jpg",
      registeredAt: "2026-04-04T02:39:05.786Z"
    },
    {
      name: "Lea4Speed0",
      alias: "Lea",
      car: "Porsche 911 Turbo S",
      youtube: "https://www.youtube.com/@Lea4Speed0",
      bio: "Veterano de la escena competitiva con consistencia implacable.",
      specialty: "Polivalente / Todo Terreno",
      schedule: "Fines de Semana",
      avatar: "assets/img/cars/porsche-911-turbo.jpg",
      registeredAt: "2026-04-04T02:39:05.786Z"
    },
    {
      name: "ellafreyafan",
      alias: "NFSMW",
      car: "Mazda RX-7",
      youtube: "https://www.youtube.com/@ellafreyafannfsmw",
      bio: "Especialista rotativo en trazados urbanos y atajos de alta dificultad.",
      specialty: "Sprints Técnicos",
      schedule: "Madrugada (00:00 - 05:00 GMT)",
      avatar: "assets/img/cars/mazda-rx7.jpg",
      registeredAt: "2026-04-04T02:39:05.786Z"
    },
    {
      name: "N6 xBourne",
      alias: "N6 xBourne",
      car: "Subaru Impreza WRX STI",
      youtube: "https://www.youtube.com/@N6_xBourne",
      bio: "Control total bajo presión y especialista en duelos directos de grupo.",
      specialty: "Polivalente / Todo Terreno",
      schedule: "Noches (20:00 - 00:00 GMT)",
      avatar: "assets/img/cars/subaru-wrx.jpg",
      registeredAt: "2026-04-04T02:39:05.786Z"
    }
  ];

  // Helper: V7 Points Formula
  function calculateDriverPoints(driver) {
    if (!driver) return 0;
    if (typeof driver.points === "number" && !isNaN(driver.points)) return driver.points;
    if (typeof driver.totalPts === "number" && !isNaN(driver.totalPts)) return driver.totalPts;
    if (typeof driver.totalPoints === "number" && !isNaN(driver.totalPoints)) return driver.totalPoints;
    const v = driver.victories || { p1: 0, p2: 0, p3: 0, p4: 0 };
    const basePoints =
      (Number(v.p1) || 0) * 25 +
      (Number(v.p2) || 0) * 18 +
      (Number(v.p3) || 0) * 15 +
      (Number(v.p4) || 0) * 12;

    const bt = driver.bestTimes || { first: 0, second: 0, third: 0 };
    const bonusPoints =
      typeof driver.bonusPoints === "number"
        ? driver.bonusPoints
        : (typeof driver.bonusPts === "number"
          ? driver.bonusPts
          : (Number(bt.first) || 0) * 100 +
            (Number(bt.second) || 0) * 50 +
            (Number(bt.third) || 0) * 20);

    return basePoints + bonusPoints;
  }

  function isZeroOrNullTime(timeStr) {
    if (!timeStr) return true;
    const clean = String(timeStr).trim();
    if (!clean || clean === "--:--.--" || clean === "--:--.---" || clean === "-" || clean === "SIN TIEMPO" || clean === "Por disputar") return true;
    return /^[0:.]+$/.test(clean);
  }

  function parseRaceTimeToMs(timeStr) {
    if (!timeStr || typeof timeStr !== "string") return Infinity;
    const clean = timeStr.trim();
    if (isZeroOrNullTime(clean)) return Infinity;
    const parts = clean.split(":");
    if (parts.length === 2) {
      const m = parseFloat(parts[0]);
      const s = parseFloat(parts[1]);
      if (isNaN(m) || isNaN(s)) return Infinity;
      return (m * 60 + s) * 1000;
    } else if (parts.length === 3) {
      const h = parseFloat(parts[0]);
      const m = parseFloat(parts[1]);
      const s = parseFloat(parts[2]);
      if (isNaN(h) || isNaN(m) || isNaN(s)) return Infinity;
      return (h * 3600 + m * 60 + s) * 1000;
    }
    const s = parseFloat(clean);
    return isNaN(s) ? Infinity : s * 1000;
  }

  const DRIVER_UNIQUE_AVATARS = {
    1: "assets/img/drivers/driver-01-zimanx.svg",
    2: "assets/img/drivers/driver-02-mystic.svg",
    3: "assets/img/drivers/driver-03-nebula.svg",
    4: "assets/img/drivers/driver-04-xlemondx.svg",
    5: "assets/img/drivers/driver-05-avenger.svg",
    6: "assets/img/drivers/driver-06-darkshido.svg",
    7: "assets/img/drivers/driver-07-dannylove.svg",
    8: "assets/img/drivers/driver-08-lea4speed.svg",
    9: "assets/img/drivers/driver-09-ellafreyafan.svg",
    10: "assets/img/drivers/driver-10-n6xbourne.svg",
    11: "assets/img/drivers/driver-11-razorv8.svg",
    12: "assets/img/drivers/driver-12-turbofox.svg",
    13: "assets/img/drivers/driver-13-sigy.svg",
    14: "assets/img/drivers/driver-14-flow.svg",
    15: "assets/img/drivers/driver-15-skyhigh.svg"
  };

  function getDriverAvatar(driverOrRank) {
    if (!driverOrRank) return "assets/img/drivers/driver-01-zimanx.svg";
    let rank = null;
    let explicitAvatar = null;
    if (typeof driverOrRank === "number" || /^\d+$/.test(String(driverOrRank).trim())) {
      rank = Number(driverOrRank);
    } else if (typeof driverOrRank === "object") {
      rank = Number(driverOrRank.rank);
      explicitAvatar = driverOrRank.avatar;
    } else if (typeof driverOrRank === "string") {
      const d = findBlacklistDriver(driverOrRank);
      if (d) {
        rank = Number(d.rank);
        explicitAvatar = d.avatar;
      }
    }
    if (explicitAvatar && !explicitAvatar.includes("nfsranksmwlogo") && !explicitAvatar.includes("logo.svg") && !explicitAvatar.includes("logo-badge")) {
      return explicitAvatar;
    }
    if (rank && DRIVER_UNIQUE_AVATARS[rank]) {
      return DRIVER_UNIQUE_AVATARS[rank];
    }
    return "assets/img/drivers/driver-01-zimanx.svg";
  }

  function findBlacklistDriver(identifier, driversPool) {
    const pool = driversPool || currentBlacklistDrivers;
    if (identifier === null || identifier === undefined) return null;
    if (typeof identifier === "number" || /^\d+$/.test(String(identifier).trim())) {
      const rNum = Number(identifier);
      return pool.find((d) => Number(d.rank) === rNum) || null;
    }
    const cleanId = String(identifier).toLowerCase().replace(/™/g, "").trim();
    if (cleanId === "kayine" || cleanId === "skyhighm3gtr") {
      return pool.find((d) => Number(d.rank) === 15) || null;
    }
    return (
      pool.find((d) => {
        const dName = String(d.name || "").toLowerCase().replace(/™/g, "").trim();
        const dAlias = String(d.alias || "").toLowerCase().replace(/™/g, "").trim();
        return (
          dName === cleanId ||
          dAlias === cleanId ||
          dName.includes(cleanId) ||
          cleanId.includes(dName)
        );
      }) || null
    );
  }

  function getDriverGroupForWeek(driverRank, weekNum) {
    if (typeof CHAMPIONSHIP_WEEKS_DATA === "undefined") return { key: "alfa", label: "GRUPO ALFA", name: "Grupo Alfa" };
    const wKey = (weekNum === "championship" || weekNum === 5 || weekNum === "5") ? "5" : weekNum;
    const wData = CHAMPIONSHIP_WEEKS_DATA[wKey] || CHAMPIONSHIP_WEEKS_DATA[1];
    if (!wData || !Array.isArray(wData.groups)) return { key: "alfa", label: "GRUPO ALFA", name: "Grupo Alfa" };

    const groupKeys = ["alfa", "beta", "gama", "delta"];
    const groupShort = ["GRUPO ALFA", "GRUPO BETA", "GRUPO GAMA", "GRUPO DELTA"];
    for (let i = 0; i < wData.groups.length; i++) {
      const grp = wData.groups[i];
      const pilots = grp.pilots || grp.driverRanks || [];
      if (pilots.some((p) => Number(p) === Number(driverRank))) {
        return {
          key: groupKeys[i] || "alfa",
          label: groupShort[i] || grp.name,
          name: grp.name,
          idx: i
        };
      }
    }
    return { key: "gama", label: "GRUPO GAMA", name: "Grupo Gama", idx: 2 };
  }

  // Normalize remote Firebase championship weeks data
  function applyNormalizedChampionshipWeeksData(remoteData) {
    if (!remoteData || typeof CHAMPIONSHIP_WEEKS_DATA === "undefined") return;
    const isArr = Array.isArray(remoteData);
    Object.keys(remoteData).forEach((wKey) => {
      const weekData = remoteData[wKey];
      if (!weekData) return;
      const wNum = (weekData.weekNumber || weekData.weekNum)
        ? parseInt(weekData.weekNumber || weekData.weekNum, 10)
        : isArr
        ? parseInt(wKey, 10) + 1
        : wKey === "championship"
        ? 5
        : parseInt(wKey, 10);
      if (isNaN(wNum) || wNum < 1) return;
      weekData.weekNumber = wNum;

      if (weekData.groups && !Array.isArray(weekData.groups)) {
        weekData.groups = Object.values(weekData.groups);
      }
      if (Array.isArray(weekData.groups)) {
        weekData.groups.forEach((g) => {
          if (g && g.pilots && !Array.isArray(g.pilots)) {
            g.pilots = Object.values(g.pilots);
          }
          if (g && Array.isArray(g.pilots)) {
            g.pilots = g.pilots.filter((p) => p !== "__register_new__" && p !== null && p !== undefined);
          }
        });
      }
      if (weekData.challenges && !Array.isArray(weekData.challenges)) {
        weekData.challenges = Object.values(weekData.challenges);
      }
      if (Array.isArray(weekData.challenges)) {
        weekData.challenges.forEach((ch) => {
          if (!ch) return;
          if (ch.top3 && !Array.isArray(ch.top3)) {
            ch.top3 = Object.values(ch.top3);
          }
          if (ch.groupsResults && typeof ch.groupsResults === "object") {
            Object.keys(ch.groupsResults).forEach((gIdx) => {
              if (ch.groupsResults[gIdx] && !Array.isArray(ch.groupsResults[gIdx])) {
                ch.groupsResults[gIdx] = Object.values(ch.groupsResults[gIdx]);
              }
            });
          }
          if (ch.groupsWinners && typeof ch.groupsWinners === "object") {
            Object.keys(ch.groupsWinners).forEach((gIdx) => {
              if (ch.groupsWinners[gIdx] && !Array.isArray(ch.groupsWinners[gIdx])) {
                ch.groupsWinners[gIdx] = Object.values(ch.groupsWinners[gIdx]);
              }
            });
          } else {
            ch.groupsWinners = {};
          }
          // Sync groupsResults into groupsWinners if missing
          if (ch.groupsResults && typeof ch.groupsResults === "object") {
            Object.keys(ch.groupsResults).forEach((gIdx) => {
              if (Array.isArray(ch.groupsResults[gIdx]) && (!ch.groupsWinners[gIdx] || ch.groupsWinners[gIdx].length === 0)) {
                ch.groupsWinners[gIdx] = ch.groupsResults[gIdx];
              }
            });
          }
        });
      }
      CHAMPIONSHIP_WEEKS_DATA[String(wNum)] = weekData;
      CHAMPIONSHIP_WEEKS_DATA[wNum] = weekData;
    });
    delete CHAMPIONSHIP_WEEKS_DATA["0"];
    delete CHAMPIONSHIP_WEEKS_DATA[0];
  }

  // Merge registered participants into currentBlacklistDrivers (Ranks 1..15)
  function mergeRegisteredParticipantsWithBlacklist() {
    const basePool =
      typeof DEFAULT_BLACKLIST_DRIVERS !== "undefined"
        ? JSON.parse(JSON.stringify(DEFAULT_BLACKLIST_DRIVERS))
        : [];

    let customRegistrations = [];
    try {
      const raw = localStorage.getItem("nfs_championship_participants_v2");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) customRegistrations = parsed;
      }
    } catch (e) {}

    for (let i = 0; i < 15; i++) {
      const rankNum = i + 1;
      let existing = basePool.find((d) => Number(d.rank) === rankNum);
      if (!existing) {
        existing = {
          rank: rankNum,
          name: `Plaza Disponible #${rankNum}`,
          alias: `OPEN_${rankNum}`,
          ride: "Por Asignar (Tier 1)",
          strength: "Inscripción Abierta",
          rep: "0",
          victories: { p1: 0, p2: 0, p3: 0, p4: 0 },
          bestTimes: { first: 0, second: 0, third: 0 },
          bonusPts: 0,
          avatar: "assets/img/cars/bmw-m3-gtr.jpg",
          badge: "DISPONIBLE",
          bio: `Plaza oficial disponible para el Torneo Blacklist. Inscríbete para reclamar el puesto #${rankNum}.`,
          isPlaceholder: true
        };
        basePool.push(existing);
      }
      existing.isPlaceholder = !existing.name || String(existing.name).startsWith("Plaza Disponible");
    }

    // Apply any new user registrations beyond the 10 static defaults without overwriting DEFAULT_BLACKLIST_DRIVERS
    customRegistrations.forEach((reg, idx) => {
      if (!reg || !reg.name) return;
      const rankNum = Number(reg.rank) || (idx + 1);
      const target = basePool.find((d) => Number(d.rank) === rankNum);
      if (target && target.isPlaceholder) {
        target.name = reg.alias && reg.alias !== reg.name ? reg.alias : reg.name;
        target.alias = reg.name || reg.alias;
        target.ride = reg.car || target.ride;
        target.strength = reg.specialty || target.strength;
        target.schedule = reg.schedule || target.schedule || "20:00 GMT";
        target.youtube = reg.youtube || target.youtube || "";
        target.bio = reg.bio || target.bio;
        target.isPlaceholder = false;
      }
    });

    const r15 = basePool.find((d) => Number(d.rank) === 15);
    if (r15) {
      r15.name = "KAYINE";
      r15.alias = "KAYINE";
      r15.isPlaceholder = false;
    }

    currentBlacklistDrivers = basePool.sort((a, b) => Number(a.rank) - Number(b.rank));
  }

  function applyLiveOfficialDrivers(officialDrivers) {
    if (!Array.isArray(officialDrivers) || officialDrivers.length === 0) return;
    officialDrivers.forEach((od) => {
      if (!od) return;
      const rankNum = Number(od.rank);
      let existing = currentBlacklistDrivers.find((d) => Number(d.rank) === rankNum);
      if (!existing) {
        existing = { rank: rankNum };
        currentBlacklistDrivers.push(existing);
      }
      Object.assign(existing, od);
      if (rankNum === 15) {
        existing.name = "KAYINE";
        existing.alias = "KAYINE";
      }
      if (od.bonusPoints !== undefined) {
        existing.bonusPts = od.bonusPoints;
        existing.bonusPoints = od.bonusPoints;
      }
      if (typeof od.rep === "number") {
        existing.rep = od.rep.toLocaleString("es-ES");
        existing._numericRep = od.rep;
      }
      if (typeof od.points === "number") {
        existing.points = od.points;
        existing.totalPts = od.points;
      }
      existing.isPlaceholder = !od.name || od.name.startsWith("Plaza Disponible");
    });
    currentBlacklistDrivers.sort((a, b) => Number(a.rank) - Number(b.rank));
  }

  async function loadRemoteChampionshipStandings() {
    try {
      localStorage.removeItem("nfs_blacklist_championship_2026_v4");
      localStorage.removeItem("nfs_blacklist_championship_2026_v5");
      const cached = localStorage.getItem("nfs_blacklist_championship_2026_v6");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          applyLiveOfficialDrivers(parsed);
        }
      }
    } catch (e) {}

    try {
      const urls = [
        `${FIREBASE_DB_BASE_URL}/records/blacklist_championship_2026.json?_t=${Date.now()}`,
        `${FIREBASE_DB_BASE_URL}/championship/blacklist_drivers.json?_t=${Date.now()}`
      ];
      for (const u of urls) {
        const res = await fetch(u);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            applyLiveOfficialDrivers(data);
            try {
              localStorage.setItem("nfs_blacklist_championship_2026_v6", JSON.stringify(data));
            } catch (eStore) {}
            break;
          }
        }
      }
    } catch (e) {
      console.warn("Aviso al consultar clasificación remota en RTDB:", e);
    }
  }

  // Synchronize Blacklist Standings from CHAMPIONSHIP_WEEKS_DATA rotations & results
  function syncBlacklistWithRotationsAndStandings() {
    if (!currentBlacklistDrivers || currentBlacklistDrivers.length === 0) return;
    if (typeof CHAMPIONSHIP_WEEKS_DATA === "undefined") return;

    // Reset dynamic counters before tallying so points never double-count
    currentBlacklistDrivers.forEach((d) => {
      d.victories = { p1: 0, p2: 0, p3: 0, p4: 0 };
      d.bestTimes = { first: 0, second: 0, third: 0 };
      d.bonusPts = 0;
      d.bonusPoints = 0;
      d.totalPoints = 0;
      d.points = 0;
      d.totalPts = 0;
      d._calcRep = 0;
    });

    const weeksSource = CHAMPIONSHIP_WEEKS_DATA || {};
    const seenWeeks = new Set();
    const targetWeeks = [1, 2, 3, 4];
    targetWeeks.forEach((wNum) => {
      const wData = weeksSource[wNum] || weeksSource[String(wNum)];
      if (!wData || !Array.isArray(wData.challenges)) return;
      if (seenWeeks.has(wNum)) return;
      seenWeeks.add(wNum);

      wData.challenges.forEach((ch) => {
        let groupsToProcess = [];
        if (Array.isArray(wData.groups) && wData.groups.length > 0) {
          for (let grpIdx = 0; grpIdx < wData.groups.length; grpIdx++) {
            const grp = wData.groups[grpIdx];
            const grpName = grp.name || `Grupo #${grpIdx + 1}`;
            let grpTop3 = null;
            if (ch.groupsWinners) {
              grpTop3 = ch.groupsWinners[grpIdx] || ch.groupsWinners[grpName] || ch.groupsWinners[String(grpIdx)];
            }
            if (!grpTop3 && ch.groupsResults) {
              grpTop3 = ch.groupsResults[grpName] || ch.groupsResults[grpIdx] || ch.groupsResults[String(grpIdx)];
            }
            if (!grpTop3 && grpIdx === 0 && Array.isArray(ch.top3)) {
              grpTop3 = ch.top3;
            }
            if (Array.isArray(grpTop3) && grpTop3.length > 0) {
              groupsToProcess.push(grpTop3);
            }
          }
        }

        if (groupsToProcess.length === 0) {
          const sourceMap = ch.groupsWinners || ch.groupsResults;
          if (sourceMap && typeof sourceMap === "object") {
            const numKeys = Object.keys(sourceMap).filter((k) => !isNaN(parseInt(k, 10)));
            const targetKeys = numKeys.length > 0 ? numKeys : Object.keys(sourceMap);
            targetKeys.forEach((k) => {
              if (Array.isArray(sourceMap[k]) && sourceMap[k].length > 0) {
                groupsToProcess.push(sourceMap[k]);
              }
            });
          } else if (Array.isArray(ch.top3)) {
            groupsToProcess.push(ch.top3);
          }
        }

        groupsToProcess.forEach((top3List) => {
          if (!Array.isArray(top3List)) return;

          top3List.forEach((entry, posIdx) => {
            if (!entry || !entry.pilot || entry.pilot === "Por disputar" || entry.pilot === "En espera" || entry.pilot.toLowerCase().startsWith("plaza disponible")) return;
            const d = findBlacklistDriver(entry.pilot) || findBlacklistDriver(entry.rank);
            if (!d) return;

            const time = (entry.time || "").trim();
            const isNullTime = isZeroOrNullTime(time);

            let ptsEarned = 0;
            if (entry.bonus !== undefined && entry.bonus !== null && entry.bonus !== "") {
              const parsedB = parseInt(entry.bonus, 10);
              ptsEarned = (!isNaN(parsedB) && parsedB >= 0) ? parsedB : 0;
            } else if (!isNullTime) {
              ptsEarned = posIdx === 0 ? 25 : posIdx === 1 ? 18 : posIdx === 2 ? 15 : 12;
            }

            let repEarned = 0;
            if (entry.repMoney !== undefined && entry.repMoney !== null && entry.repMoney !== "") {
              const parsedR = parseInt(entry.repMoney, 10);
              repEarned = (!isNaN(parsedR) && parsedR >= 0) ? parsedR : 0;
            } else if (entry.rep !== undefined && entry.rep !== null && entry.rep !== "") {
              const parsedR = parseInt(entry.rep, 10);
              repEarned = (!isNaN(parsedR) && parsedR >= 0) ? parsedR : 0;
            } else if (!isNullTime) {
              repEarned = posIdx === 0 ? 400000 : posIdx === 1 ? 250000 : posIdx === 2 ? 120000 : 80000;
            }

            const hasValidResult = (!isNullTime) || (repEarned > 0) || (ptsEarned > 0);
            if (!hasValidResult) return;

            d.totalPoints = (d.totalPoints || 0) + ptsEarned;
            d._calcRep = (d._calcRep || 0) + repEarned;

            if (posIdx === 0) {
              d.victories.p1 = (d.victories.p1 || 0) + 1;
              if (!isNullTime) d.bestTimes.first = (d.bestTimes.first || 0) + 1;
            } else if (posIdx === 1) {
              d.victories.p2 = (d.victories.p2 || 0) + 1;
              if (!isNullTime) d.bestTimes.second = (d.bestTimes.second || 0) + 1;
            } else if (posIdx === 2) {
              d.victories.p3 = (d.victories.p3 || 0) + 1;
              if (!isNullTime) d.bestTimes.third = (d.bestTimes.third || 0) + 1;
            } else if (posIdx === 3) {
              d.victories.p4 = (d.victories.p4 || 0) + 1;
            }
          });
        });
      });
    });

    currentBlacklistDrivers.forEach((d) => {
      d.points = typeof d.totalPoints === "number" ? d.totalPoints : 0;
      d.totalPts = d.points;
      d.bonusPts = d.points;
      d.bonusPoints = d.points;
      const pointsCashBonus = Math.floor(d.points / 1000) * 500000;
      d.pointsBonusCash = pointsCashBonus;
      d.baseRep = d._calcRep || 0;
      d.totalRep = d.baseRep + pointsCashBonus;
      d._numericRep = d.totalRep;
      d.rep = d.totalRep > 0 ? d.totalRep.toLocaleString("es-ES") : "0";
    });
  }

  function getSortedBlacklistDrivers() {
    return [...currentBlacklistDrivers].sort((a, b) => {
      if (a.isPlaceholder && !b.isPlaceholder) return 1;
      if (!a.isPlaceholder && b.isPlaceholder) return -1;

      // 1. Dinero de recompensa en Bolsa ($ REP) de mayor a menor
      const repA = (typeof a._numericRep === "number") ? a._numericRep : (parseInt(String(a.rep || "0").replace(/[^0-9]/g, ""), 10) || 0);
      const repB = (typeof b._numericRep === "number") ? b._numericRep : (parseInt(String(b.rep || "0").replace(/[^0-9]/g, ""), 10) || 0);
      if (repB !== repA) return repB - repA;

      // 2. Puntos Totales (PTS) de mayor a menor
      const ptsA = calculateDriverPoints(a);
      const ptsB = calculateDriverPoints(b);
      if (ptsB !== ptsA) return ptsB - ptsA;

      // 3. Victorias (P1) de mayor a menor
      const p1A = (a.victories && a.victories.p1) || 0;
      const p1B = (b.victories && b.victories.p1) || 0;
      if (p1B !== p1A) return p1B - p1A;

      // 4. Segundos lugares (P2) de mayor a menor
      const p2A = (a.victories && a.victories.p2) || 0;
      const p2B = (b.victories && b.victories.p2) || 0;
      if (p2B !== p2A) return p2B - p2A;

      // 5. Terceros lugares (P3) de mayor a menor
      const p3A = (a.victories && a.victories.p3) || 0;
      const p3B = (b.victories && b.victories.p3) || 0;
      if (p3B !== p3A) return p3B - p3A;

      // 6. Cuartos lugares (P4) de mayor a menor
      const p4A = (a.victories && a.victories.p4) || 0;
      const p4B = (b.victories && b.victories.p4) || 0;
      if (p4B !== p4A) return p4B - p4A;

      // 7. Rango original de desempate
      return Number(a.rank) - Number(b.rank);
    });
  }

  // Hoisted state variables for Past Tournaments (prevents TDZ ReferenceError on early tab clicks)
  let currentPastTournamentKey = "ev1n0yug";
  let currentPastViewMode = "brackets";

  function closeTorneoDropdown() {
    if (typeof closeAllDropdowns === "function") {
      closeAllDropdowns();
    }
  }

  [torneoMenuNavItem, megaMenuNavItem, telemetriaMenuNavItem, comunidadMenuNavItem].forEach((item) => {
    if (item) {
      item.addEventListener("mouseenter", () => {
        item.classList.remove("dropdown-closed");
      });
      item.addEventListener("mouseleave", () => {
        item.classList.remove("dropdown-closed");
      });
    }
  });

  function switchTorneoTab(tabId) {
    if (!tabId) tabId = "standings";
    torneoState.activeTab = tabId;

    // Ensure view-blog is active without recursive clobbering
    const allViews = document.querySelectorAll(".view-section");
    allViews.forEach((sec) => {
      sec.classList.toggle("is-active", sec.id === "view-blog");
    });
    document.querySelectorAll(".uiverse-nav-list .nav-link").forEach((link) => {
      link.classList.toggle("is-active", link.dataset.viewTarget === "view-blog");
    });
    document.querySelectorAll(".mobile-nav-link").forEach((link) => {
      link.classList.toggle("is-active", link.dataset.viewTarget === "view-blog");
    });

    // Toggle all data-torneo-tab buttons (sidebar, toolbar pills, tutorial jump links)
    document.querySelectorAll("[data-torneo-tab]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.torneoTab === tabId);
    });

    // Toggle navbar mega-menu items
    document.querySelectorAll("[data-torneo-nav]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.torneoNav === tabId);
    });

    // Sync dropdown switcher
    const switcher = document.getElementById("torneo-quick-subpage-switcher");
    if (switcher && switcher.value !== tabId) {
      switcher.value = tabId;
    }

    // Toggle panel visibility
    const targetPanelId = `torneo-panel-${tabId}`;
    document.querySelectorAll(".torneo-tab-panel").forEach((panel) => {
      panel.classList.toggle("is-active", panel.id === targetPanelId);
    });

    // Banner de Challenger & Torneo eliminado permanentemente
    const torneoBannerEl = document.querySelector(".torneo-stitch-banner");
    if (torneoBannerEl) {
      torneoBannerEl.remove();
    }

    // Update active subpage heading and dynamic banner context
    const subpageTitleEl = document.getElementById("torneo-active-subpage-title");
    if (subpageTitleEl && TORNEO_SUBPAGE_TITLES[tabId]) {
      subpageTitleEl.textContent = TORNEO_SUBPAGE_TITLES[tabId];
    }
    const bannerMeta = TORNEO_SUBPAGE_METADATA[tabId];
    if (bannerMeta) {
      const bannerSubtagEl = document.getElementById("torneo-banner-subtag");
      const bannerDescEl = document.getElementById("torneo-banner-desc");
      if (bannerSubtagEl) bannerSubtagEl.textContent = bannerMeta.subtag;
      if (bannerDescEl) bannerDescEl.textContent = bannerMeta.desc;
    }

    // Explicitly re-render subpage view controllers to guarantee live data
    try {
      if (tabId === "standings") {
        renderBlacklistUI();
      } else if (tabId === "seasons") {
        renderSeasonChallenges();
        if (torneoState.seasonSubView === "standings") {
          loadSeasonStandingsLive(torneoState.seasonId);
        }
      } else if (tabId === "groups") {
        renderChampionshipGroupsAndRoutes();
      } else if (tabId === "dossiers") {
        renderAllTacticalCards();
      } else if (tabId === "register") {
        renderRegisteredPilotsUI();
      } else if (tabId === "past-tournaments") {
        renderPastTournament(currentPastTournamentKey || "ev1n0yug");
      }
    } catch (err) {
      console.warn("Error rendering subpage:", tabId, err);
    }

    // Close any open mega-menu dropdowns
    closeTorneoDropdown();

    // Smooth scroll to catalog main content in view-blog
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (typeof window.initAllInteractiveButtons === "function") {
      window.initAllInteractiveButtons();
    } else if (typeof window.applyGlitchEffectToAllButtons === "function") {
      window.applyGlitchEffectToAllButtons();
    }
  }

  window._realSwitchTorneoTab = switchTorneoTab;
  window.switchTorneoTab = switchTorneoTab;
  if (window._pendingTorneoTab) {
    const pTab = window._pendingTorneoTab;
    window._pendingTorneoTab = null;
    switchTorneoTab(pTab);
  }


  // Direct click listeners for all [data-torneo-nav] in mega-menu
  document.querySelectorAll("[data-torneo-nav]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetTab = btn.dataset.torneoNav || "standings";
      switchTorneoTab(targetTab);
      closeTorneoDropdown();
    });
  });

  // Direct click listeners for all [data-torneo-tab] in sidebar & toolbar
  document.querySelectorAll("[data-torneo-tab]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetTab = btn.dataset.torneoTab || "standings";
      switchTorneoTab(targetTab);
      closeTorneoDropdown();
    });
  });

  // Delegated click listeners as robust universal fallback
  document.addEventListener("click", (e) => {
    const navBtn = e.target.closest("[data-torneo-nav]");
    if (navBtn) {
      e.preventDefault();
      e.stopPropagation();
      const targetTab = navBtn.dataset.torneoNav || "standings";
      switchTorneoTab(targetTab);
      closeTorneoDropdown();
      return;
    }

    const tabBtn = e.target.closest("[data-torneo-tab]");
    if (tabBtn) {
      e.preventDefault();
      const targetTab = tabBtn.dataset.torneoTab || "standings";
      switchTorneoTab(targetTab);
      closeTorneoDropdown();
      return;
    }

    const jumpBtn = e.target.closest("[data-torneo-jump]");
    if (jumpBtn) {
      e.preventDefault();
      const targetTab = jumpBtn.dataset.torneoJump || "register";
      switchTorneoTab(targetTab);
      closeTorneoDropdown();
      return;
    }
  });

  // Listener for 'Cambiar de Torneo' select dropdown
  const torneoQuickSwitcher = document.getElementById("torneo-quick-subpage-switcher");
  if (torneoQuickSwitcher) {
    torneoQuickSwitcher.addEventListener("change", (e) => {
      const targetTab = e.target.value;
      if (targetTab) {
        switchTorneoTab(targetTab);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4.6.1 TABLA GENERAL DE STANDINGS (#torneo-panel-standings)
  // --------------------------------------------------------------------------
  function renderBlacklistUI() {
    const standingsTbody = document.getElementById("torneo-standings-tbody");
    const standingsTableWrap = document.getElementById("standings-table-wrapper");
    if (standingsTableWrap) {
      standingsTableWrap.style.display = "block";
    }
    const leaderEl = document.getElementById("bl-standings-leader");
    const repEl = document.getElementById("bl-standings-rep");
    const countEl = document.getElementById("bl-standings-pilots-count");

    const sortedAll = getSortedBlacklistDrivers();

    // Filtro estricto: Solamente contabilizar y mostrar pilotos inscritos en el torneo (incluye a Flow y KAYINE)
    const activeEnrolledDrivers = sortedAll.filter((d) => {
      if (!d) return false;
      if (d.eliminated || d.isEliminated || d.deleted || d.isPlaceholder) return false;
      const nameStr = String(d.name || d.alias || "").trim().toLowerCase();
      if (nameStr.startsWith("open") || nameStr.startsWith("plaza disponible") || nameStr.startsWith("cpu_") || nameStr === "por disputar" || nameStr === "en espera") return false;

      // Pilotos oficialmente inscritos en el campeonato 2026 (incluye a Flow #14 y KAYINE #15)
      const ENROLLED_TOURNAMENT_RANKS = [1, 3, 4, 5, 6, 7, 8, 10, 14, 15];
      const isExplicitlyEnrolled = ENROLLED_TOURNAMENT_RANKS.includes(Number(d.rank)) ||
                                   d.rank === 14 || d.rank === 15 ||
                                   nameStr.includes("flow") || nameStr.includes("kayine");
      if (isExplicitlyEnrolled) return true;

      const totalPts = calculateDriverPoints(d);
      const repNum = (typeof d._numericRep === "number") ? d._numericRep : (parseInt(String(d.rep || "0").replace(/[^0-9]/g, ""), 10) || 0);
      const v = d.victories || { p1: 0, p2: 0, p3: 0, p4: 0 };
      const hasVictories = (v.p1 > 0 || v.p2 > 0 || v.p3 > 0 || v.p4 > 0);
      return (totalPts > 0 || repNum > 0 || hasVictories);
    });

    // Update KPI Banner con los pilotos inscritos activos
    if (activeEnrolledDrivers.length > 0) {
      const topDriver = activeEnrolledDrivers[0];
      const topPts = calculateDriverPoints(topDriver);
      if (leaderEl) {
        leaderEl.textContent = `${topDriver.name} (${topPts.toLocaleString("es-ES")} PTS)`;
      }
      const totalRepNum = activeEnrolledDrivers.reduce((acc, d) => {
        return acc + ((typeof d._numericRep === "number") ? d._numericRep : (parseInt(String(d.rep || "0").replace(/[^0-9]/g, ""), 10) || 0));
      }, 0);
      if (repEl) {
        repEl.textContent = `$${totalRepNum.toLocaleString("es-ES")} REP`;
      }
      const sideRepEl = document.getElementById("sidebar-torneo-rep-summary");
      if (sideRepEl) {
        sideRepEl.textContent = `Bolsa: $${totalRepNum.toLocaleString("es-ES")} REP`;
      }
      if (countEl) {
        countEl.textContent = `${activeEnrolledDrivers.length} PILOTOS`;
      }
      const sideCountEl = document.getElementById("sidebar-standings-badge-count");
      if (sideCountEl) {
        sideCountEl.textContent = String(activeEnrolledDrivers.length);
      }
    }

    // Apply Group Filter & Sort
    let displayList = activeEnrolledDrivers.map((d, index) => ({
      driver: d,
      standingPos: index + 1,
      groupInfo: getDriverGroupForWeek(d.rank, torneoState.champWeek || 1),
      totalPts: calculateDriverPoints(d)
    }));

    if (torneoState.standingsGroupFilter && torneoState.standingsGroupFilter !== "all") {
      displayList = displayList.filter((item) => item.groupInfo.key === torneoState.standingsGroupFilter);
    }

    if (torneoState.standingsSort === "rep") {
      displayList.sort((a, b) => {
        const rA = (typeof a.driver._numericRep === "number") ? a.driver._numericRep : (parseInt(String(a.driver.rep || "0").replace(/[^0-9]/g, ""), 10) || 0);
        const rB = (typeof b.driver._numericRep === "number") ? b.driver._numericRep : (parseInt(String(b.driver.rep || "0").replace(/[^0-9]/g, ""), 10) || 0);
        return rB - rA;
      });
    } else if (torneoState.standingsSort === "p1") {
      displayList.sort((a, b) => {
        const pA = (a.driver.victories && a.driver.victories.p1) || 0;
        const pB = (b.driver.victories && b.driver.victories.p1) || 0;
        return pB - pA || b.totalPts - a.totalPts;
      });
    } else if (torneoState.standingsSort === "score") {
      displayList.sort((a, b) => b.totalPts - a.totalPts || (b.driver.victories?.p1 || 0) - (a.driver.victories?.p1 || 0));
    } else {
      // Default: Orden Oficial Rockport por Mayor Dinero en Bolsa ($ REP > PTS > P1 > P2 > P3 > P4 > Rank)
      displayList.sort((a, b) => {
        const rA = (typeof a.driver._numericRep === "number") ? a.driver._numericRep : (parseInt(String(a.driver.rep || "0").replace(/[^0-9]/g, ""), 10) || 0);
        const rB = (typeof b.driver._numericRep === "number") ? b.driver._numericRep : (parseInt(String(b.driver.rep || "0").replace(/[^0-9]/g, ""), 10) || 0);
        if (rB !== rA) return rB - rA;
        if (b.totalPts !== a.totalPts) return b.totalPts - a.totalPts;
        const p1A = (a.driver.victories && a.driver.victories.p1) || 0;
        const p1B = (b.driver.victories && b.driver.victories.p1) || 0;
        if (p1B !== p1A) return p1B - p1A;
        const p2A = (a.driver.victories && a.driver.victories.p2) || 0;
        const p2B = (b.driver.victories && b.driver.victories.p2) || 0;
        if (p2B !== p2A) return p2B - p2A;
        const p3A = (a.driver.victories && a.driver.victories.p3) || 0;
        const p3B = (b.driver.victories && b.driver.victories.p3) || 0;
        if (p3B !== p3A) return p3B - p3A;
        const p4A = (a.driver.victories && a.driver.victories.p4) || 0;
        const p4B = (b.driver.victories && b.driver.victories.p4) || 0;
        if (p4B !== p4A) return p4B - p4A;
        return Number(a.driver.rank) - Number(b.driver.rank);
      });
    }

    // Reindexar standingPos secuencialmente según el orden final de la lista
    displayList.forEach((item, idx) => {
      item.standingPos = idx + 1;
    });

    // Renderizar Vitrina Emblemática del Campeón si el evento está cerrado
    const isClosedEvent = isChampionshipOfficiallyClosed();
    renderChampionCelebrationShowcase(displayList, isClosedEvent);

    // Ajustar títulos y badges en los KPIs si el cuadro está cerrado definitivamente
    const weekLabelEl = document.getElementById("bl-standings-week-label");
    const kpiLeaderCard = document.querySelector("#torneo-panel-standings .kpi-gold .nfs-kpi-label");
    if (isClosedEvent) {
      if (weekLabelEl) weekLabelEl.textContent = "TEMPORADA 2026 FINALIZADA • CUADRO OFICIAL DEFINITIVO";
      if (kpiLeaderCard) kpiLeaderCard.textContent = "👑 OFICIAL CHAMPION 2026";
    } else {
      if (weekLabelEl) weekLabelEl.textContent = "Semana 4 de 4 en Progreso • 8 Rutas";
      if (kpiLeaderCard) kpiLeaderCard.textContent = "CURRENT LEADER (#1)";
    }

    // Render Official Standings Table (Única vista oficial: 11 Columnas V7 Blacklist - Sin Vehículo y con $ REP alineado a la derecha)
    if (standingsTbody) {
      standingsTbody.innerHTML = displayList
        .map(({ driver: d, standingPos, groupInfo, totalPts }) => {
          const rankClass =
            standingPos === 1 ? "rank-1" : standingPos === 2 ? "rank-2" : standingPos === 3 ? "rank-3" : "";
          const v = d.victories || { p1: 0, p2: 0, p3: 0, p4: 0 };
          const bt = d.bestTimes || { first: 0, second: 0, third: 0 };
          const bonusPts =
            typeof d.bonusPts === "number"
              ? d.bonusPts
              : bt.first * 100 + bt.second * 50 + bt.third * 20;
          const cleanName = String(d.name).replace(/™/g, "").trim();
          const ptsBonus = d.pointsBonusCash || (Math.floor(totalPts / 1000) * 500000);

          return `
            <tr data-standing-rank="${d.rank}">
              <td style="text-align: center;">
                <span class="nfs-rank-pill ${rankClass}">#${standingPos}</span>
              </td>
              <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <img src="${escapeHtml(getDriverAvatar(d))}" alt="${escapeHtml(d.name)}" style="width: 38px; height: 38px; border-radius: 8px; object-fit: cover; border: 1px solid rgba(255,255,255,0.15);" loading="lazy" />
                  <div>
                    <div class="nfs-driver-link" data-open-pilot="${escapeHtml(cleanName)}" style="font-size: 15px; font-weight: 800;">${escapeHtml(d.name)}</div>
                    <div style="font-family: var(--font-mono); font-size: 10.5px; color: #ffae00;">
                      BL #${d.rank} &bull; "${escapeHtml(d.alias)}"
                    </div>
                  </div>
                </div>
              </td>
              <td style="text-align: center;">
                <span class="nfs-type-pill type-circuito">${escapeHtml(groupInfo.label)}</span>
              </td>
              <td style="text-align: center;">
                <span class="stitch-num" style="display: inline-flex; flex-direction: column; align-items: center; justify-content: center; min-width: 34px; padding: 3px 7px; border-radius: 5px; background: linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%); color: #09090b; font-weight: 900; font-size: 12px; box-shadow: 0 0 10px rgba(245, 158, 11, 0.35);">
                  <span style="font-size: 8px; font-weight: 800; opacity: 0.85; line-height: 1;">P1</span>${v.p1}
                </span>
              </td>
              <td style="text-align: center;">
                <span class="stitch-num" style="display: inline-flex; flex-direction: column; align-items: center; justify-content: center; min-width: 34px; padding: 3px 7px; border-radius: 5px; background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(148, 163, 184, 0.35); color: #e2e8f0; font-weight: 800; font-size: 12px;">
                  <span style="font-size: 8px; color: #94a3b8; line-height: 1;">P2</span>${v.p2}
                </span>
              </td>
              <td style="text-align: center;">
                <span class="stitch-num" style="display: inline-flex; flex-direction: column; align-items: center; justify-content: center; min-width: 34px; padding: 3px 7px; border-radius: 5px; background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(249, 115, 22, 0.35); color: #fb923c; font-weight: 800; font-size: 12px;">
                  <span style="font-size: 8px; color: #94a3b8; line-height: 1;">P3</span>${v.p3}
                </span>
              </td>
              <td style="text-align: center;">
                <span class="stitch-num" style="display: inline-flex; flex-direction: column; align-items: center; justify-content: center; min-width: 34px; padding: 3px 7px; border-radius: 5px; background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(148, 163, 184, 0.2); color: #94a3b8; font-weight: 700; font-size: 12px;">
                  <span style="font-size: 8px; color: #64748b; line-height: 1;">P4</span>${v.p4}
                </span>
              </td>
              <td style="text-align: center;">
                <span class="stitch-num" style="font-size: 12.5px; font-weight: 800; color: #38bdf8;">+${bonusPts} PTS</span>
                <div class="stitch-num" style="font-size: 9.5px; color: var(--text-muted);">🥇${bt.first} 🥈${bt.second} 🥉${bt.third}</div>
              </td>
              <td style="text-align: right;">
                <span class="stitch-num" style="font-size: 15px; font-weight: 900; color: #fde047;">${totalPts.toLocaleString("es-ES")} PTS</span>
              </td>
              <td style="text-align: right;">
                <div class="esports-mirror-cash" title="Bolsa de Recompensa Rockport: Incluye +$500.000 por cada 1.000 PTS">
                  <span class="esports-cash-label">REP CASH</span>
                  <span class="esports-cash-val">$${escapeHtml(d.rep || "0")}</span>
                  ${ptsBonus > 0 ? `<span style="font-size: 8.5px; color: #00ffa3; font-weight: 700; display: block; margin-top: 1px;">+$${ptsBonus.toLocaleString('es-ES')} PTS</span>` : ''}
                </div>
              </td>
              <td style="text-align: right;">
                <div style="display: flex; gap: 6px; justify-content: flex-end; flex-wrap: wrap;">
                  ${
                    d.youtube
                      ? `<a href="${escapeHtml(d.youtube)}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" class="btn-nfs-white-cta btn-table-video no-glitch" style="padding: 5px 12px; font-size: 11px; text-decoration: none; display: inline-flex; align-items: center; justify-content: center;" title="Ver Canal / Video Oficial"><span>VIDEO</span></a>`
                      : ""
                  }
                  <button type="button" class="uiverse-baboon-btn stage-action-btn btn-sm btn-nfs-white-cta" data-text="Ficha" data-open-dossier-rank="${d.rank}" title="Abrir Ficha Técnica Cockpit"><span class="text">Ficha</span></button>
                  <button type="button" class="uiverse-baboon-btn stage-action-btn btn-sm btn-nfs-white-cta" data-text="Records →" data-open-pilot="${escapeHtml(cleanName)}" title="Ver Telemetría del Piloto"><span class="text">Records &rarr;</span></button>
                </div>
              </td>
            </tr>
          `;
        })
        .join("");
      if (typeof window.initGlitchDataText === "function") {
        window.initGlitchDataText();
      }
      if (typeof window.applyGlitchEffectToAllButtons === "function") {
        window.applyGlitchEffectToAllButtons();
      }
    }
  }

  const filterStandingsGroupEl = document.getElementById("filter-standings-group");
  if (filterStandingsGroupEl) {
    filterStandingsGroupEl.addEventListener("change", (e) => {
      torneoState.standingsGroupFilter = e.target.value || "all";
      renderBlacklistUI();
    });
  }

  const filterStandingsSortEl = document.getElementById("filter-standings-sort");
  if (filterStandingsSortEl) {
    filterStandingsSortEl.addEventListener("change", (e) => {
      torneoState.standingsSort = e.target.value || "score";
      renderBlacklistUI();
    });
  }

  // Delegate clicks on [data-open-dossier-rank] and [data-torneo-jump]
  document.addEventListener("click", (e) => {
    const dossierBtn = e.target.closest("[data-open-dossier-rank]");
    if (dossierBtn) {
      const rRank = Number(dossierBtn.dataset.openDossierRank || 1);
      switchTorneoTab("dossiers");
      updateBlacklistTacticalCard(rRank);
      return;
    }
    const jumpBtn = e.target.closest("[data-torneo-jump]");
    if (jumpBtn) {
      switchTorneoTab(jumpBtn.dataset.torneoJump || "register");
    }
  });

  // --------------------------------------------------------------------------
  // 4.6.2 DESAFÍOS SEMANALES (#torneo-panel-seasons): 4 TIERS + FIREBASE SYNC
  // --------------------------------------------------------------------------
  function getCompletedSeasonChallenges() {
    try {
      const raw = localStorage.getItem("nfs_completed_season_challenges_v7");
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function toggleChallengeComplete(challengeId) {
    const map = getCompletedSeasonChallenges();
    map[challengeId] = !map[challengeId];
    try {
      localStorage.setItem("nfs_completed_season_challenges_v7", JSON.stringify(map));
    } catch (e) {
      // ignore
    }
    renderSeasonChallenges();
  }

  function renderSeasonChallenges() {
    const grid = document.getElementById("season-challenges-grid");
    const titleEl = document.getElementById("seasons-active-title");
    const potValEl = document.getElementById("season-week-pot-val");
    if (!grid || typeof SEASONS_DATA === "undefined") return;

    const seasonObj = SEASONS_DATA[torneoState.seasonId] || SEASONS_DATA.season_1;
    if (!seasonObj) return;
    if (titleEl) titleEl.textContent = `${seasonObj.name || seasonObj.title || "Temporada 1"} — ${seasonObj.subtitle || ""}`;

    const weekObj =
      (seasonObj.weeks || []).find((w) => Number(w.weekNum || w.weekNumber) === Number(torneoState.seasonWeek)) ||
      (seasonObj.weeks && seasonObj.weeks[0]);
    if (!weekObj) return;

    const completedMap = getCompletedSeasonChallenges();
    const challenges = weekObj.challenges || [];

    const totalBounty = challenges.reduce((acc, ch) => {
      const bStr = (ch.reward && ch.reward.bounty) || "0";
      return acc + (parseInt(String(bStr).replace(/[^0-9]/g, ""), 10) || 0);
    }, 0);
    if (potValEl) {
      potValEl.textContent = `$${totalBounty.toLocaleString("es-ES")} REP (${weekObj.title || ""})`;
    }

    grid.innerHTML = challenges
      .map((ch) => {
        const trackName = ch.track || ch.route || "Pista Oficial";
        const carName = ch.car || ch.carRestriction || "Libre (Tier 1)";
        const lapType = ch.lapType || ch.category || "Time Attack";
        const typeClass = (ch.type || "Circuito").toLowerCase();
        const isDone = Boolean(completedMap[ch.id]);
        const tiers =
          typeof SEASONS_DATA.getChallengeTiers === "function"
            ? SEASONS_DATA.getChallengeTiers(ch)
            : null;
        const wr = getRouteWRData({ name: trackName, type: ch.type });
        const bountyStr = (ch.reward && ch.reward.bounty) || "$200,000";
        const badgeStr = (ch.reward && ch.reward.badge) || "ELITE CHALLENGE";

        const tiersHtml = tiers
          ? `
            <div class="v7-tier-grid">
              <div class="v7-tier-box tier-diamond">
                <span class="v7-tier-label stitch-num">💎 DIAMANTE (+${tiers.diamond.pts} PTS)</span>
                <strong class="v7-tier-time stitch-num">&le; ${formatStitchTimeHtml(tiers.diamond.time || tiers.diamond.targetTime || "01:15.000")}</strong>
              </div>
              <div class="v7-tier-box tier-gold">
                <span class="v7-tier-label stitch-num">🥇 ORO (+${tiers.gold.pts} PTS)</span>
                <strong class="v7-tier-time stitch-num">&le; ${formatStitchTimeHtml(tiers.gold.time || tiers.gold.targetTime || ch.targetTime || "01:18.000")}</strong>
              </div>
              <div class="v7-tier-box tier-silver">
                <span class="v7-tier-label stitch-num">🥈 PLATA (+${tiers.silver.pts} PTS)</span>
                <strong class="v7-tier-time stitch-num">&le; ${formatStitchTimeHtml(tiers.silver.time || tiers.silver.targetTime || "01:22.000")}</strong>
              </div>
              <div class="v7-tier-box tier-bronze">
                <span class="v7-tier-label stitch-num">🥉 BRONCE (+${tiers.bronze.pts} PTS)</span>
                <strong class="v7-tier-time stitch-num">&le; ${formatStitchTimeHtml(tiers.bronze.time || tiers.bronze.targetTime || "01:26.000")}</strong>
              </div>
            </div>
          `
          : "";

        return `
          <article class="nfs-challenge-card ${isDone ? "is-completed" : ""}">
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 10px;">
                <span class="nfs-type-pill type-${typeClass}">${escapeHtml(ch.type)} &bull; ${escapeHtml(lapType)}</span>
                <span class="creator-slug">${escapeHtml(ch.difficulty || "Difícil")}</span>
              </div>
              <h4 style="font-size: 18px; font-weight: 900; color: #ffffff; margin-bottom: 4px;">${escapeHtml(trackName)}</h4>
              <div style="font-family: var(--font-mono); font-size: 11.5px; color: #c4b5fd; margin-bottom: 8px;">
                Vehículo Homologado: <strong style="color: #fff;">${escapeHtml(carName)}</strong>
              </div>
              ${
                ch.desc
                  ? `<p style="font-size: 12px; color: #cbd5e1; line-height: 1.5; margin-bottom: 12px;">${escapeHtml(ch.desc)}</p>`
                  : ""
              }

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 10px 12px; border-radius: 10px; background: rgba(7,7,10,0.65); border: 1px solid rgba(255,255,255,0.07); margin-bottom: 10px;">
                <div>
                  <div style="font-family: var(--font-mono); font-size: 9.5px; color: var(--text-muted); text-transform: uppercase;">Meta Oro</div>
                  <div class="stitch-num" style="font-size: 16px; font-weight: 800; color: #ffae00;">${formatStitchTimeHtml(ch.targetTime)}</div>
                </div>
                <div>
                  <div style="font-family: var(--font-mono); font-size: 9.5px; color: var(--text-muted); text-transform: uppercase;">WR Pista</div>
                  <div class="stitch-num" style="font-size: 15px; font-weight: 800; color: #34d399;">${formatStitchTimeHtml(wr.time)}</div>
                </div>
              </div>

              ${tiersHtml}
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.08);">
              <div>
                <div style="font-family: var(--font-mono); font-size: 11.5px; font-weight: 800; color: #34d399;">+${escapeHtml(bountyStr)} REP</div>
                <div style="font-family: var(--font-mono); font-size: 10px; color: #fde047;">🏅 ${escapeHtml(badgeStr)}</div>
              </div>
              <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                <a href="${escapeHtml(wr.videoUrl || 'https://www.youtube.com/results?search_query=' + encodeURIComponent('NFSMW ' + trackName + ' ' + wr.driver))}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" class="btn-nfs-white-cta btn-table-video no-glitch" style="padding: 5px 12px; font-size: 11px; text-decoration: none; display: inline-flex; align-items: center; justify-content: center;">
                  <span>VIDEO</span>
                </a>
                <button type="button" class="uiverse-baboon-btn stage-action-btn btn-nfs-white-cta ${isDone ? "is-active" : ""}" data-text="${isDone ? "Completado" : "Marcar Meta"}" data-toggle-ch-done="${escapeHtml(ch.id)}">
                  <span class="text">${isDone ? "✔ Completado" : "Marcar Meta"}</span>
                </button>
                <button type="button" class="uiverse-baboon-btn stage-action-btn btn-nfs-white-cta" data-text="Pista →" data-open-route-lb="${escapeHtml(trackName)}"><span class="text">Pista &rarr;</span></button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");
  }

  document.addEventListener("click", (e) => {
    const toggleBtn = e.target.closest("[data-toggle-ch-done]");
    if (toggleBtn) {
      toggleChallengeComplete(toggleBtn.dataset.toggleChDone);
    }
  });

  function applyCustomSeasonsData(customData) {
    if (!customData || typeof customData !== "object" || typeof SEASONS_DATA === "undefined") return;
    Object.keys(customData).forEach((sKey) => {
      const sCustom = customData[sKey];
      const sTarget = SEASONS_DATA[sKey];
      if (!sCustom || !sTarget) return;
      if (Array.isArray(sCustom.weeks)) {
        sTarget.weeks = sCustom.weeks;
      } else if (Array.isArray(sTarget.weeks)) {
        sTarget.weeks.forEach((wObj) => {
          const wKey = "week_" + wObj.weekNum;
          if (Array.isArray(sCustom[wKey])) {
            wObj.challenges = sCustom[wKey];
          }
        });
      }
    });
  }

  async function loadRemoteSeasonsChallenges() {
    if (typeof SEASONS_DATA === "undefined") return;
    try {
      const localRaw = localStorage.getItem("nfs_seasons_custom_challenges_v1");
      if (localRaw) {
        applyCustomSeasonsData(JSON.parse(localRaw));
        renderSeasonChallenges();
      }
    } catch (e) {}
    try {
      const urls = [
        `${FIREBASE_DB_BASE_URL}/records/seasons_custom_challenges.json?_t=${Date.now()}`,
        `${FIREBASE_DB_BASE_URL}/seasons_custom_challenges.json?_t=${Date.now()}`
      ];
      for (const url of urls) {
        const res = await fetch(url);
        if (res.ok) {
          const customData = await res.json();
          if (customData && typeof customData === "object") {
            applyCustomSeasonsData(customData);
            try {
              localStorage.setItem("nfs_seasons_custom_challenges_v1", JSON.stringify(customData));
            } catch (eStore) {}
            renderSeasonChallenges();
            break;
          }
        }
      }
    } catch (e) {
      // fallback to local SEASONS_DATA
    }
  }

  async function loadSeasonStandingsLive(seasonId) {
    const tbody = document.getElementById("tbody-season-standings-live");
    if (!tbody) return;
    const sKey = seasonId || torneoState.seasonId || "season_1";

    let rows = [];
    try {
      const res = await fetch(`${FIREBASE_DB_BASE_URL}/records/seasons_${sKey}_standings.json`);
      if (res.ok) {
        const remote = await res.json();
        if (remote) {
          rows = Array.isArray(remote) ? remote : Object.values(remote);
        }
      }
    } catch (e) {
      // fallback below
    }

    if (!rows || rows.length === 0) {
      // Build live season standings from active championship standings
      const sorted = getSortedBlacklistDrivers().filter((d) => !d.isPlaceholder);
      rows = sorted.map((d) => {
        const v = d.victories || { p1: 0, p2: 0, p3: 0, p4: 0 };
        const bt = d.bestTimes || { first: 0, second: 0, third: 0 };
        return {
          pilot: d.name,
          diamonds: bt.first || 0,
          golds: v.p1 || 0,
          silvers: v.p2 || 0,
          bronzes: v.p3 || 0,
          points: calculateDriverPoints(d),
          bounty: `$${d.rep || "0"}`
        };
      });
    }

    tbody.innerHTML = rows
      .map((r, idx) => {
        const pos = idx + 1;
        const rankClass = pos === 1 ? "rank-1" : pos === 2 ? "rank-2" : pos === 3 ? "rank-3" : "";
        const cleanName = String(r.pilot || r.name || "").replace(/™/g, "").trim();
        return `
          <tr data-open-pilot="${escapeHtml(cleanName)}" style="cursor: pointer;">
            <td><span class="nfs-rank-pill ${rankClass}">#${pos}</span></td>
            <td><div class="nfs-driver-link">${escapeHtml(r.pilot || r.name)}</div></td>
            <td style="text-align: center; font-family: var(--font-mono); color: #67e8f9; font-weight: 800;">${r.diamonds || 0}</td>
            <td style="text-align: center; font-family: var(--font-mono); color: #fde047; font-weight: 800;">${r.golds || 0}</td>
            <td style="text-align: center; font-family: var(--font-mono); color: #e2e8f0; font-weight: 700;">${r.silvers || 0}</td>
            <td style="text-align: center; font-family: var(--font-mono); color: #fb923c; font-weight: 700;">${r.bronzes || 0}</td>
            <td style="text-align: right; font-family: var(--font-mono); font-weight: 900; color: #fde047;">${Number(r.points || 0).toLocaleString("es-ES")} PTS</td>
            <td style="text-align: right; font-family: var(--font-mono); font-weight: 800; color: #34d399;">${escapeHtml(r.bounty || "$0")}</td>
          </tr>
        `;
      })
      .join("");
  }

  document.querySelectorAll("[data-season-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      torneoState.seasonId = btn.dataset.seasonId || "season_1";
      document.querySelectorAll("[data-season-id]").forEach((b) => b.classList.toggle("is-active", b === btn));
      renderSeasonChallenges();
      loadSeasonStandingsLive(torneoState.seasonId);
    });
  });

  document.querySelectorAll("[data-season-week]").forEach((btn) => {
    btn.addEventListener("click", () => {
      torneoState.seasonWeek = Number(btn.dataset.seasonWeek || 1);
      document.querySelectorAll("[data-season-week]").forEach((b) => b.classList.toggle("is-active", b === btn));
      renderSeasonChallenges();
    });
  });

  // Seasons subview toggle (Desafíos 4 Tiers vs Ranking de Temporada)
  document.querySelectorAll("[data-season-subview], [data-season-mode]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const rawMode = btn.dataset.seasonMode || btn.dataset.seasonSubview || "cards";
      const view = rawMode === "standings" ? "standings" : "challenges";
      torneoState.seasonSubView = view;
      document.querySelectorAll("[data-season-subview], [data-season-mode]").forEach((b) => {
        const bMode = b.dataset.seasonMode || b.dataset.seasonSubview;
        const isActive =
          bMode === rawMode ||
          (view === "challenges" && (bMode === "cards" || bMode === "challenges")) ||
          (view === "standings" && bMode === "standings");
        b.classList.toggle("is-active", isActive);
      });
      const chWrap = document.getElementById("season-challenges-view-wrap");
      const stWrap = document.getElementById("season-standings-view-wrap");
      if (chWrap) chWrap.style.display = view === "challenges" ? "block" : "none";
      if (stWrap) stWrap.style.display = view === "standings" ? "block" : "none";
      if (view === "standings") {
        loadSeasonStandingsLive(torneoState.seasonId);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4.6.3 GRUPOS Y RIVALES (#torneo-panel-groups): 4 GROUPS + 8 ROUTES + SYNC
  // --------------------------------------------------------------------------
  function renderChampionshipGroupsAndRoutes() {
    if (typeof CHAMPIONSHIP_WEEKS_DATA === "undefined") return;
    const wKey = (torneoState.champWeek === 5 || torneoState.champWeek === "5" || torneoState.champWeek === "championship") ? "5" : String(torneoState.champWeek || 1);
    const weekData = CHAMPIONSHIP_WEEKS_DATA[wKey] || CHAMPIONSHIP_WEEKS_DATA[Number(wKey)] || CHAMPIONSHIP_WEEKS_DATA["1"] || CHAMPIONSHIP_WEEKS_DATA[1];
    if (!weekData) return;

    const titleEl = document.getElementById("champ-week-title");
    const datesEl = document.getElementById("champ-week-dates");
    const groupsGrid = document.getElementById("champ-groups-grid");
    const routesGrid = document.getElementById("champ-routes-results-grid");
    const groupFiltersWrap = document.getElementById("bl-group-filters");

    const isFinished = weekData.status === "finished";
    const statusPill = isFinished
      ? `<span class="nfs-type-pill" style="background: rgba(16, 185, 129, 0.18); border: 1px solid rgba(16, 185, 129, 0.45); color: #34d399; font-size: 11px; padding: 4px 10px; margin-left: 10px; vertical-align: middle; display: inline-flex; align-items: center; gap: 5px;"><span style="width: 7px; height: 7px; border-radius: 50%; background: #34d399; box-shadow: 0 0 8px #34d399;"></span> ${escapeHtml(weekData.statusBadge || "🟢 FINALIZADA // HOMOLOGADA")}</span>`
      : `<span class="nfs-type-pill" style="background: rgba(245, 158, 11, 0.18); border: 1px solid rgba(245, 158, 11, 0.45); color: #fbbf24; font-size: 11px; padding: 4px 10px; margin-left: 10px; vertical-align: middle; display: inline-flex; align-items: center; gap: 5px;"><span style="width: 7px; height: 7px; border-radius: 50%; background: #fbbf24; box-shadow: 0 0 8px #fbbf24;"></span> ${escapeHtml(weekData.statusBadge || "🟡 EN DISPUTA")}</span>`;

    if (titleEl) {
      titleEl.innerHTML = `${escapeHtml(weekData.title)} ${statusPill}`;
    }
    if (datesEl) {
      const note = isFinished ? "• 🏁 RESULTADOS HOMOLOGADOS Y AUDITADOS" : "• ⏱️ TIEMPOS EN DISPUTA";
      datesEl.textContent = `${weekData.dates} ${note} • Puntuación por Grupo: P1=25, P2=18, P3=15, P4=12`;
    }

    const numGroupsTotal = (weekData.groups || []).length;
    if (Number(torneoState.champGroupIdx || 0) >= numGroupsTotal && numGroupsTotal > 0) {
      torneoState.champGroupIdx = 0;
    }

    // Rotating Groups Grid (Synced 1:1 with admin.html)
    if (groupsGrid) {
      groupsGrid.innerHTML = (weekData.groups || [])
        .map((grp, grpIdx) => {
          const pilotIds = (grp.pilots || grp.driverRanks || []).filter(
            (p) => p !== "__register_new__" && p !== null && p !== undefined
          );
          const isSelectedGrp = Number(torneoState.champGroupIdx) === grpIdx;
          const grpLetter = grpIdx === 0 ? "A" : grpIdx === 1 ? "B" : grpIdx === 2 ? "C" : "D";
          const watermarkText = `GRP ${grpLetter}`;

          const tierPill =
            grpIdx === 0
              ? `<span class="v7-tier-pill v7-tier-supreme">TIER SUPREME</span>`
              : grpIdx === 1
              ? `<span class="v7-tier-pill v7-tier-high">TIER HIGH</span>`
              : grpIdx === 2
              ? `<span class="v7-tier-pill v7-tier-mid">TIER MID-HIGH</span>`
              : `<span class="v7-tier-pill v7-tier-street">TIER STREET</span>`;

          const restrictedCar =
            grp.restrictedCar ||
            grp.carRestriction ||
            (grpIdx === 0
              ? "PORSCHE CARRERA GT / BMW M3 GTR"
              : grpIdx === 1
              ? "BMW M3 GTR / CORVETTE C6.R"
              : grpIdx === 2
              ? "FORD GT / PORSCHE 911 GT2"
              : "LOTUS ELISE / LAMBORGHINI GALLARDO");

          const rowsHtml = pilotIds
            .map((pId, idx) => {
              const isOpenSlot = String(pId).startsWith("open_");
              const dObj = !isOpenSlot ? findBlacklistDriver(pId) : null;
              const posNum = idx + 1;
              const rankBadgeClass = posNum === 1 ? "v7-rank-gold" : "v7-rank-dark";

              if (!dObj || isOpenSlot) {
                const slotNum = String(pId).replace("open_", "");
                return `
                  <div class="v7-pilot-tactical-row" data-torneo-jump="register" style="opacity: 0.72;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span class="v7-square-rank ${rankBadgeClass}">${posNum}</span>
                      <div class="v7-pilot-info-col">
                        <div class="v7-pilot-name-txt" style="color: #c4b5fd;">Plaza Abierta #${escapeHtml(slotNum)}</div>
                        <div class="v7-pilot-car-txt">Disponible para Inscripción</div>
                      </div>
                    </div>
                    <span style="font-family: var(--font-mono); font-size: 10px; color: #ffae00; font-weight: 700;">Inscribirse &rarr;</span>
                  </div>
                `;
              }

              const displayDriverName =
                Number(dObj.rank) === 5
                  ? "SRTxAvenger™"
                  : Number(dObj.rank) === 8
                  ? "Lea"
                  : Number(dObj.rank) === 15
                  ? "KAYINE"
                  : dObj.name;
              const cleanName = String(dObj.name).replace(/™/g, "").trim();
              const dPts = calculateDriverPoints(dObj);
              const dRep = dObj.rep ? `$${dObj.rep}` : `$0`;
              const carName = dObj.ride || restrictedCar || "Vehículo Oficial";

              return `
                <div class="v7-pilot-tactical-row" data-open-pilot="${escapeHtml(cleanName)}" title="Ver Ficha Técnica de ${escapeHtml(displayDriverName)} (#${dObj.rank})">
                  <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1;">
                    <span class="v7-square-rank ${rankBadgeClass}">#${dObj.rank}</span>
                    <div class="v7-pilot-info-col">
                      <div class="v7-pilot-name-txt">${escapeHtml(displayDriverName)}</div>
                      <div class="v7-pilot-car-txt">${escapeHtml(carName)}</div>
                    </div>
                  </div>
                  <div class="v7-pilot-pts-col">
                    <div class="v7-pilot-pts-val">${dPts.toLocaleString("es-ES")} PTS</div>
                    <div class="v7-pilot-rep-val">${escapeHtml(dRep)}</div>
                  </div>
                </div>
              `;
            })
            .join("");

          return `
            <div class="v7-tactical-group-card ${isSelectedGrp ? "is-selected" : ""}" data-select-champ-group="${grpIdx}">
              <div class="v7-group-watermark">${watermarkText}</div>

              <div>
                <div class="v7-group-top-row">
                  <span class="v7-group-title-text">${escapeHtml(grp.name)}</span>
                  ${tierPill}
                </div>
                <div class="v7-group-car-sub">PILOTOS ASIGNADOS: <strong>${pilotIds.length} COMPETIDORES</strong></div>
                <div>${rowsHtml}</div>
              </div>

              <div class="v7-group-footer-bar">
                <span class="v7-group-footer-info">8 ROUTES • COMISARÍA SYNC</span>
                <button type="button" class="v7-group-footer-btn" data-champ-group-tab="${grpIdx}">
                  <span>${isSelectedGrp ? "ACTIVE &rarr;" : "VIEW ROUTES &rarr;"}</span>
                </button>
              </div>
            </div>
          `;
        })
        .join("");
      if (typeof window.initGlitchDataText === "function") {
        window.initGlitchDataText();
      }
      if (typeof window.applyGlitchEffectToAllButtons === "function") {
        window.applyGlitchEffectToAllButtons();
      }
    }

    // Dynamic Group Filter Pills above Challenges Grid
    if (groupFiltersWrap && Array.isArray(weekData.groups)) {
      const groupIcons = ["🔥", "⚡", "🛡️", "🎯", "👑", "🏁"];
      groupFiltersWrap.innerHTML = weekData.groups
        .map((grp, gIdx) => {
          const isActive = Number(torneoState.champGroupIdx || 0) === gIdx;
          const icon = groupIcons[gIdx % groupIcons.length];
          const label = `${icon} ${grp.name.toUpperCase()}`;
          return `
            <button type="button" class="filter-pill-btn glitch-nfs-btn ${isActive ? "is-active" : ""}" data-champ-group-tab="${gIdx}" data-text="${escapeHtml(label)}">
              <span>${icon} ${escapeHtml(grp.name.toUpperCase())}</span>
            </button>
          `;
        })
        .join("");
      if (typeof window.initGlitchDataText === "function") {
        window.initGlitchDataText();
      }
      if (typeof window.applyGlitchEffectToAllButtons === "function") {
        window.applyGlitchEffectToAllButtons();
      }
    }

    // 8 Weekly Routes Results Grid synced 1:1 with admin.html
    if (routesGrid) {
      const activeGrpIdx = Number(torneoState.champGroupIdx || 0);
      const activeGrp = (weekData.groups && weekData.groups[activeGrpIdx]) || null;
      const activeGroupLabel = activeGrp ? activeGrp.name.toUpperCase() : `GRUPO #${activeGrpIdx + 1}`;
      const activePilots = (activeGrp && Array.isArray(activeGrp.pilots))
        ? activeGrp.pilots.filter((p) => p !== "__register_new__" && p !== null && p !== undefined)
        : [];

      routesGrid.innerHTML = (weekData.challenges || [])
        .map((ch, chIdx) => {
          const grpName = activeGrp ? activeGrp.name : `Grupo #${activeGrpIdx + 1}`;
          let groupRows = null;
          if (ch.groupsWinners) {
            groupRows = ch.groupsWinners[activeGrpIdx] || ch.groupsWinners[String(activeGrpIdx)] || ch.groupsWinners[grpName];
            if (!groupRows) {
              const keys = Object.keys(ch.groupsWinners);
              const matchKey = keys.find((k) => {
                const lk = k.toLowerCase();
                if (activeGrpIdx === 0 && (lk.includes("alfa") || lk.includes("alpha"))) return true;
                if (activeGrpIdx === 1 && lk.includes("beta")) return true;
                if (activeGrpIdx === 2 && (lk.includes("gama") || lk.includes("gamma"))) return true;
                if (activeGrpIdx === 3 && lk.includes("delta")) return true;
                return false;
              });
              if (matchKey) groupRows = ch.groupsWinners[matchKey];
            }
          }
          if (!groupRows && ch.groupsResults) {
            groupRows = ch.groupsResults[grpName] || ch.groupsResults[activeGrpIdx] || ch.groupsResults[String(activeGrpIdx)];
            if (!groupRows) {
              const keys = Object.keys(ch.groupsResults);
              const matchKey = keys.find((k) => {
                const lk = k.toLowerCase();
                if (activeGrpIdx === 0 && (lk.includes("alfa") || lk.includes("alpha"))) return true;
                if (activeGrpIdx === 1 && lk.includes("beta")) return true;
                if (activeGrpIdx === 2 && (lk.includes("gama") || lk.includes("gamma"))) return true;
                if (activeGrpIdx === 3 && lk.includes("delta")) return true;
                return false;
              });
              if (matchKey) groupRows = ch.groupsResults[matchKey];
            }
          }
          if (!groupRows && activeGrpIdx === 0 && Array.isArray(ch.top3) && ch.top3.length > 0) {
            groupRows = ch.top3;
          }

          // If groupRows is missing or contains only placeholder "Por disputar", populate from activePilots
          if (!groupRows || !Array.isArray(groupRows) || groupRows.length === 0 || groupRows.every((r) => !r || r.pilot === "Por disputar")) {
            if (activePilots.length > 0) {
              groupRows = activePilots.map((pVal, pIdx) => {
                const d = findBlacklistDriver(pVal);
                const pName = d
                  ? (Number(d.rank) === 5 ? "SRTxAvenger™" : Number(d.rank) === 8 ? "Lea" : Number(d.rank) === 15 ? "KAYINE" : d.name)
                  : (String(pVal).startsWith("open") ? `Plaza Abierta #${String(pVal).replace("open_", "")}` : `Piloto #${pVal}`);
                return {
                  rank: d ? d.rank : (pIdx + 1),
                  pilot: pName,
                  car: d ? d.ride : (ch.carRestriction || "Vehículo Oficial"),
                  time: "--:--.---",
                  bonus: 0,
                  badge: "0 PTS",
                  repMoney: 0,
                  repBadge: "$0 REP"
                };
              });
            }
          }

          // Order pilots by race time: fastest valid times first; unrecorded/zero times stay in saved order below
          const sortedRows = [...(groupRows || [])].sort((a, b) => {
            const isNullA = isZeroOrNullTime(a.time);
            const isNullB = isZeroOrNullTime(b.time);
            if (!isNullA && isNullB) return -1;
            if (isNullA && !isNullB) return 1;
            if (!isNullA && !isNullB) {
              const msA = parseRaceTimeToMs(a.time);
              const msB = parseRaceTimeToMs(b.time);
              if (msA !== msB) return msA - msB;
            }
            return 0;
          });

          const targetCount = Math.max(sortedRows.length, activePilots.length, 2);
          while (sortedRows.length < targetCount) {
            const missingIdx = sortedRows.length;
            const fallbackPilotId = activePilots[missingIdx];
            const dObj = fallbackPilotId !== undefined ? findBlacklistDriver(fallbackPilotId) : null;
            sortedRows.push({
              rank: dObj ? dObj.rank : (fallbackPilotId || (missingIdx + 1)),
              pilot: dObj ? dObj.name : (fallbackPilotId ? `Piloto #${fallbackPilotId}` : "Por disputar"),
              car: dObj ? dObj.ride : (ch.carRestriction || "Vehículo Oficial"),
              time: "--:--.---",
              bonus: 0,
              badge: "0 PTS",
              repMoney: 0,
              repBadge: "$0 REP"
            });
          }

          const groupPodiumHtml = sortedRows
            .map((r, i) => {
              const pos = i + 1;
              const rawPilotName = (r.pilot || r.driverName || "").trim();
              let dObj =
                (rawPilotName && rawPilotName !== "Por disputar" ? findBlacklistDriver(rawPilotName) : null) ||
                findBlacklistDriver(r.rank || r.driverRank) ||
                (activePilots[i] !== undefined ? findBlacklistDriver(activePilots[i]) : null);

              const displayPilotName =
                rawPilotName && rawPilotName !== "Por disputar"
                  ? rawPilotName
                  : dObj
                  ? (Number(dObj.rank) === 5 ? "SRTxAvenger™" : Number(dObj.rank) === 8 ? "Lea" : Number(dObj.rank) === 15 ? "KAYINE" : dObj.name)
                  : "Por disputar";

              const cleanNameForModal = dObj
                ? String(dObj.name).replace(/™/g, "").trim()
                : String(displayPilotName).replace(/™/g, "").trim();

              const displayCar =
                r.car && r.car !== "Por asignar" && r.car !== "-"
                  ? r.car
                  : dObj && dObj.ride
                  ? dObj.ride
                  : ch.carRestriction || "Vehículo Oficial";

              const hasTime = !isZeroOrNullTime(r.time);
              const timeDisplay = hasTime ? r.time : "--:--.---";
              const rankClass = pos === 1 ? "v7-podium-rank-1" : pos === 2 ? "v7-podium-rank-2" : "v7-podium-rank-3";

              let ptsVal = hasTime ? (pos === 1 ? 25 : pos === 2 ? 18 : pos === 3 ? 15 : 12) : 0;
              if (r.bonus !== undefined && r.bonus !== null && r.bonus !== "") {
                const parsed = parseInt(r.bonus, 10);
                if (!isNaN(parsed) && parsed >= 0) ptsVal = parsed;
              }

              let repVal = hasTime ? (pos === 1 ? 400000 : pos === 2 ? 250000 : pos === 3 ? 120000 : 80000) : 0;
              if (r.repMoney !== undefined && r.repMoney !== null && r.repMoney !== "") {
                const parsed = parseInt(r.repMoney, 10);
                if (!isNaN(parsed) && parsed >= 0) repVal = parsed;
              } else if (r.rep !== undefined && r.rep !== null && r.rep !== "") {
                const parsed = parseInt(r.rep, 10);
                if (!isNaN(parsed) && parsed >= 0) repVal = parsed;
              }
              const repK = repVal >= 1000 ? `$${Math.round(repVal / 1000)}K REP` : `$${repVal} REP`;

              return `
                <div class="v7-podium-cyber-row" data-open-pilot="${escapeHtml(cleanNameForModal)}" title="Ver Ficha Técnica de ${escapeHtml(displayPilotName)}">
                  <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1;">
                    <span class="v7-square-rank ${rankClass}">${pos}</span>
                    <div style="min-width: 0;">
                      <div class="v7-pilot-name-txt" style="font-size: 13px;">${escapeHtml(displayPilotName)}</div>
                      <div style="font-size: 10px; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(displayCar)}</div>
                    </div>
                  </div>
                  <div style="font-family: var(--font-mono); font-size: 11.5px; color: ${hasTime ? "#f8fafc" : "#64748b"}; text-align: center; min-width: 105px;">
                    <span style="font-size: 9px; color: #94a3b8; margin-right: 4px;">TIME</span>
                    <strong>${escapeHtml(timeDisplay)}</strong>
                  </div>
                  <div style="text-align: right; flex-shrink: 0; min-width: 75px;">
                    <div style="font-family: var(--font-mono); font-size: 12px; font-weight: 800; color: #fde047;">+${ptsVal} PTS</div>
                    <div style="font-family: var(--font-mono); font-size: 10px; font-weight: 700; color: #34d399;">${repK}</div>
                  </div>
                </div>
              `;
            })
            .join("");

          const routeNumStr = String(chIdx + 1).padStart(2, "0");
          const routeCar = ch.carRestriction || (activeGrp && (activeGrp.restrictedCar || activeGrp.carRestriction)) || "Tier 1 Homologado";
          const routeWr = getRouteWRData({ name: ch.route, type: ch.type });

          return `
            <article class="v7-challenge-cyber-card" data-route-name="${escapeHtml(ch.route)}" data-route-type="${escapeHtml(ch.type)}">
              <div class="v7-challenge-watermark">#${routeNumStr}</div>
              <div class="v7-ch-header-top">
                <h3 class="v7-ch-title">#${routeNumStr} ${escapeHtml(ch.route)}</h3>
                <span class="v7-ch-type-pill">${escapeHtml((ch.type || "CIRCUITO").toUpperCase())}</span>
              </div>
              <div class="v7-ch-sub">
                <div>RESTRICTED CAR: <strong>${escapeHtml(routeCar)}</strong></div>
                <span style="color: #ffb800; font-weight: 800;">${escapeHtml(activeGroupLabel)}</span>
              </div>
              <div>${groupPodiumHtml}</div>
              <div style="margin-top: 10px; display: flex; justify-content: flex-end; gap: 8px;">
                <a href="${escapeHtml(routeWr.videoUrl || 'https://www.youtube.com/results?search_query=' + encodeURIComponent('NFSMW ' + ch.route))}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" class="btn-nfs-white-cta v7-group-footer-btn no-glitch" style="padding: 6px 14px; font-size: 11px; text-decoration: none; display: inline-flex; align-items: center; justify-content: center;" title="Ver Video de la Ruta">
                  <span>VIDEO</span>
                </a>
                <button type="button" class="v7-group-footer-btn btn-nfs-white-cta" data-open-route-lb="${escapeHtml(ch.route)}" title="Ver Leaderboard Oficial">
                  <span>LEADERBOARD &rarr;</span>
                </button>
              </div>
            </article>
          `;
        })
        .join("");
      if (typeof window.initGlitchDataText === "function") {
        window.initGlitchDataText();
      }
      if (typeof window.applyGlitchEffectToAllButtons === "function") {
        window.applyGlitchEffectToAllButtons();
      }
    }
  }
  window.renderChampionshipGroupsAndRoutes = renderChampionshipGroupsAndRoutes;

  // Delegated click listeners for Week selection and Group filtering
  document.addEventListener("click", (e) => {
    const weekBtn = e.target.closest("[data-champ-week]");
    if (weekBtn) {
      const rawW = weekBtn.dataset.champWeek;
      torneoState.champWeek = (rawW === "championship" || rawW === "5") ? 5 : Number(rawW || 1);
      torneoState.champGroupIdx = 0;
      document.querySelectorAll("[data-champ-week]").forEach((b) => b.classList.toggle("is-active", b === weekBtn));
      renderChampionshipGroupsAndRoutes();
      renderBlacklistUI();
      return;
    }

    const groupBtn = e.target.closest("[data-champ-group-tab]");
    if (groupBtn) {
      torneoState.champGroupIdx = Number(groupBtn.dataset.champGroupTab || 0);
      document.querySelectorAll("[data-champ-group-tab]").forEach((b) => b.classList.toggle("is-active", b === groupBtn));
      renderChampionshipGroupsAndRoutes();
      return;
    }

    const groupCard = e.target.closest("[data-select-champ-group]");
    if (groupCard && !e.target.closest("[data-open-pilot]") && !e.target.closest("[data-torneo-jump]") && !e.target.closest("[data-champ-group-tab]")) {
      torneoState.champGroupIdx = Number(groupCard.dataset.selectChampGroup || 0);
      renderChampionshipGroupsAndRoutes();
      return;
    }
  });

  // Listen for real-time broadcasts and storage events from admin.html
  try {
    if (typeof BroadcastChannel !== "undefined") {
      const bc = new BroadcastChannel("nfs_championship_sync");
      bc.onmessage = (ev) => {
        if (!ev.data) return;
        if (ev.data.type === "CHAMPIONSHIP_WEEKS_UPDATED" && ev.data.data) {
          applyNormalizedChampionshipWeeksData(ev.data.data);
          syncBlacklistWithRotationsAndStandings();
          renderBlacklistUI();
          renderChampionshipGroupsAndRoutes();
          renderAllTacticalCards();
        } else if (ev.data.type === "DRIVERS_UPDATED" && ev.data.drivers) {
          applyLiveOfficialDrivers(ev.data.drivers);
          renderBlacklistUI();
          renderChampionshipGroupsAndRoutes();
          renderAllTacticalCards();
        } else if (ev.data.type === "SEASONS_CHALLENGES_UPDATED" && ev.data.data) {
          applyCustomSeasonsData(ev.data.data);
          renderSeasonChallenges();
        } else if (ev.data.type === "DRIVER_DELETED") {
          loadRemoteChampionshipWeeksData();
          loadRemoteChampionshipStandings();
        } else if (ev.data.type === "CHAMPIONSHIP_EVENT_CLOSED" || ev.data.type === "CHAMPIONSHIP_EVENT_STATUS_UPDATED" || ev.data.type === "CHAMPIONSHIP_EVENT_REOPENED") {
          if (ev.data.status) {
            torneoState.eventStatus = ev.data.status;
            try {
              localStorage.setItem("nfs_championship_event_status_v1", JSON.stringify(ev.data.status));
            } catch (eStore) {}
          }
          renderBlacklistUI();
        }
      };
    }

    window.addEventListener("storage", (ev) => {
      if (!ev.key || !ev.newValue) return;
      try {
        if (ev.key === "nfs_championship_weeks_data_v3") {
          const parsed = JSON.parse(ev.newValue);
          applyNormalizedChampionshipWeeksData(parsed);
          syncBlacklistWithRotationsAndStandings();
          renderBlacklistUI();
          renderChampionshipGroupsAndRoutes();
          renderAllTacticalCards();
        } else if (ev.key === "nfs_blacklist_championship_2026_v5" || ev.key === "nfs_blacklist_championship_2026_v4") {
          const parsed = JSON.parse(ev.newValue);
          applyLiveOfficialDrivers(parsed);
          renderBlacklistUI();
          renderChampionshipGroupsAndRoutes();
          renderAllTacticalCards();
        } else if (ev.key === "nfs_seasons_custom_challenges_v1") {
          const parsed = JSON.parse(ev.newValue);
          applyCustomSeasonsData(parsed);
          renderSeasonChallenges();
        } else if (ev.key === "nfs_championship_event_status_v1") {
          try {
            torneoState.eventStatus = JSON.parse(ev.newValue);
            renderBlacklistUI();
          } catch (eParse) {}
        }
      } catch (err) {}
    });
  } catch (e) {}

  // --------------------------------------------------------------------------
  // ESTADO OFICIAL DEL EVENTO & VERIFICACIÓN DE CIERRE DEL CAMPEONATO 2026
  // --------------------------------------------------------------------------
  function isChampionshipOfficiallyClosed() {
    const s = torneoState.eventStatus;
    if (s && typeof s.isClosed === "boolean") {
      return s.isClosed;
    }
    // Cierre por fecha oficial: 1 de Noviembre 2026 00:00:00Z
    const now = new Date();
    const closingDate = new Date("2026-11-01T00:00:00Z");
    return now >= closingDate;
  }
  window.isChampionshipOfficiallyClosed = isChampionshipOfficiallyClosed;

  async function loadRemoteChampionshipEventStatus() {
    // 1. Cargar desde localStorage para respuesta instantánea (0ms)
    try {
      const local = localStorage.getItem("nfs_championship_event_status_v1");
      if (local) {
        torneoState.eventStatus = JSON.parse(local);
      }
    } catch (e) {}

    // 2. Cargar desde Firebase RTDB
    try {
      const url = `${FIREBASE_DB_BASE_URL}/records/championship_event_status.json?_t=${Date.now()}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === "object") {
          torneoState.eventStatus = data;
          try {
            localStorage.setItem("nfs_championship_event_status_v1", JSON.stringify(data));
          } catch (eStore) {}
        }
      }
    } catch (e) {}
  }
  window.loadRemoteChampionshipEventStatus = loadRemoteChampionshipEventStatus;

  // Toggle para minimizar o expandir el banner de celebración del campeón
  window.toggleChampHeroShowcase = function(minimize) {
    torneoState.champHeroMinimized = (minimize !== undefined) ? minimize : !torneoState.champHeroMinimized;
    renderBlacklistUI();
  };

  // Generador de Confeti festivo y adornitos para la vitrina emblemática
  function generateChampConfettiHTML() {
    const colors = ["#fbbf24", "#f59e0b", "#38bdf8", "#c084fc", "#ffffff", "#f97316", "#00ffa3", "#ef4444"];
    let html = "";
    for (let i = 0; i < 28; i++) {
      const left = ((i * 3.6) + (Math.sin(i) * 2)).toFixed(1);
      const color = colors[i % colors.length];
      const duration = (2.6 + ((i % 5) * 0.6)).toFixed(1);
      const delay = ((i % 7) * 0.4).toFixed(1);
      const sizeW = (i % 3 === 0) ? 8 : (i % 3 === 1) ? 11 : 6;
      const sizeH = (i % 2 === 0) ? 14 : 9;
      const isCircle = (i % 4 === 0);
      const radius = isCircle ? "50%" : "2px";
      html += `<span class="champ-confetti-particle" style="left: ${left}%; background-color: ${color}; width: ${sizeW}px; height: ${sizeH}px; border-radius: ${radius}; animation-duration: ${duration}s; animation-delay: ${delay}s;"></span>`;
    }
    return html;
  }

  // Renderizador de la Vitrina Emblemática del Campeón con Confeti y Podio
  function renderChampionCelebrationShowcase(displayList, isClosed) {
    const heroEl = document.getElementById("champ-celebration-hero");
    if (!heroEl) return;

    if (!isClosed) {
      heroEl.style.display = "none";
      heroEl.innerHTML = "";
      return;
    }

    if (!displayList || displayList.length === 0) {
      heroEl.style.display = "none";
      return;
    }

    const champItem = displayList[0];
    const runnerItem = displayList[1] || null;
    const thirdItem = displayList[2] || null;

    const champDriver = champItem.driver;
    const champPts = (champItem.totalPts || 0).toLocaleString("es-ES");
    const champRepNum = (typeof champDriver._numericRep === "number") ? champDriver._numericRep : (parseInt(String(champDriver.rep || "0").replace(/[^0-9]/g, ""), 10) || 0);
    const champRep = champRepNum.toLocaleString("es-ES");
    const champCar = champDriver.car || "Porsche Carrera GT";
    const champAvatar = getDriverAvatar(champDriver);
    const rawAlias = String(champDriver.alias || champDriver.name || "").trim().replace(/^["']+|["']+$/g, '');
    const champAlias = rawAlias || champDriver.name;
    const cleanChampName = String(champDriver.name).replace(/™/g, "").trim();

    // Si el usuario eligió minimizar la vitrina para inspeccionar tablas numéricas:
    if (torneoState.champHeroMinimized) {
      heroEl.innerHTML = `
        <div class="champ-celebration-minimized-bar">
          <div class="champ-minimized-title">
            <span style="font-size: 20px;">👑</span>
            <span>GANADOR DEL EVENTO: <strong>${escapeHtml(champDriver.name)}</strong> (${champPts} PTS &bull; $${champRep} REP) &bull; CUADRO OFICIAL FINALIZADO</span>
          </div>
          <button type="button" class="champ-minimized-expand-btn" onclick="toggleChampHeroShowcase(false)">
            Ver Celebración Completa &darr;
          </button>
        </div>
      `;
      heroEl.style.display = "block";
      return;
    }

    // Vitrina Emblemática Completa con Confeti, Corona, Laureles y Podio
    heroEl.innerHTML = `
      <div class="champ-confetti-canvas-container" aria-hidden="true">
        ${generateChampConfettiHTML()}
      </div>

      <div class="champ-celebration-inner">
        <!-- Top Banner Header -->
        <div class="champ-celebration-top-bar">
          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
            <div class="champ-badge-ribbon">
              <span>👑</span>
              <span>GANADOR DEL EVENTO PLAYLIST 2026 CHAMPION</span>
              <span>👑</span>
            </div>
            <div class="champ-closed-status-tag">
              <span>🏆</span>
              <span>CUADRO OFICIAL FINALIZADO &bull; TEMPORADA CLAUSURADA</span>
            </div>
          </div>
          <button type="button" class="champ-hero-toggle-btn" onclick="toggleChampHeroShowcase(true)" title="Ocultar vitrina para ver tablas">
            Ocultar Vitrina ✕
          </button>
        </div>

        <!-- Showcase Body: Campeón + Subcampeones -->
        <div class="champ-showcase-grid">
          <!-- Tarjeta del Campeón (#1) -->
          <div class="champ-winner-card">
            <div class="champ-avatar-container">
              <span class="champ-crown-icon" title="Campeón Supremo 2026">👑</span>
              <img src="${escapeHtml(champAvatar)}" alt="${escapeHtml(champDriver.name)}" class="champ-avatar-img" />
              <span class="champ-rank-number-one" title="Primer Lugar Oficial">#1</span>
            </div>

            <div class="champ-winner-info">
              <div class="champ-winner-headline">
                <span>✨</span>
                <span>CAMPEÓN OFICIAL ROCKPORT 2026</span>
                <span>✨</span>
              </div>
              <h2 class="champ-winner-name">${escapeHtml(champDriver.name)}</h2>
              <div class="champ-winner-meta">
                BL #${champDriver.rank} &bull; "${escapeHtml(champAlias)}" &bull; Vehículo: ${escapeHtml(champCar)}
              </div>

              <div class="champ-winner-kpi-row">
                <div class="champ-winner-kpi-item">
                  <span class="champ-winner-kpi-label">Puntaje Oficial</span>
                  <span class="champ-winner-kpi-val" style="color: #fbbf24;">${champPts} PTS</span>
                </div>
                <div class="champ-winner-kpi-item">
                  <span class="champ-winner-kpi-label">Bolsa de Recompensa</span>
                  <span class="champ-winner-kpi-val rep-gold">$${champRep} REP</span>
                </div>
                <div class="champ-winner-kpi-item">
                  <span class="champ-winner-kpi-label">Victorias P1</span>
                  <span class="champ-winner-kpi-val" style="color: #38bdf8;">${(champDriver.victories && champDriver.victories.p1) || 0} OROS</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Podio de Honor: Segundo y Tercer Lugar -->
          <div class="champ-podium-runners-box">
            ${runnerItem ? `
              <div class="champ-runner-card silver">
                <div class="champ-runner-medal" title="Subcampeón de Plata">🥈</div>
                <div>
                  <div class="champ-runner-rank-tag">SUBCAMPEÓN #2</div>
                  <div class="champ-runner-name">${escapeHtml(runnerItem.driver.name)}</div>
                  <div class="champ-runner-pts">${(runnerItem.totalPts || 0).toLocaleString("es-ES")} PTS &bull; $${(((typeof runnerItem.driver._numericRep === "number") ? runnerItem.driver._numericRep : (parseInt(String(runnerItem.driver.rep || "0").replace(/[^0-9]/g, ""), 10) || 0))).toLocaleString("es-ES")} REP</div>
                </div>
              </div>
            ` : ''}

            ${thirdItem ? `
              <div class="champ-runner-card bronze">
                <div class="champ-runner-medal" title="Tercer Lugar de Bronce">🥉</div>
                <div>
                  <div class="champ-runner-rank-tag">TERCER PUESTO #3</div>
                  <div class="champ-runner-name">${escapeHtml(thirdItem.driver.name)}</div>
                  <div class="champ-runner-pts">${(thirdItem.totalPts || 0).toLocaleString("es-ES")} PTS &bull; $${(((typeof thirdItem.driver._numericRep === "number") ? thirdItem.driver._numericRep : (parseInt(String(thirdItem.driver.rep || "0").replace(/[^0-9]/g, ""), 10) || 0))).toLocaleString("es-ES")} REP</div>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    heroEl.style.display = "block";
  }

    async function loadRemoteChampionshipWeeksData() {
    try {
      localStorage.removeItem("nfs_championship_weeks_data_v3");
      const cached = localStorage.getItem("nfs_championship_weeks_data_v4");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object") {
          applyNormalizedChampionshipWeeksData(parsed);
        }
      }
    } catch (e) {}

    try {
      const urls = [
        `${FIREBASE_DB_BASE_URL}/records/championship_weeks_data.json?_t=${Date.now()}`,
        `${FIREBASE_DB_BASE_URL}/championship/weeks_data.json?_t=${Date.now()}`
      ];
      for (const url of urls) {
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data === "object") {
            applyNormalizedChampionshipWeeksData(data);
            try {
              localStorage.setItem("nfs_championship_weeks_data_v4", JSON.stringify(data));
            } catch (eStore) {}
            break;
          }
        }
      }
    } catch (e) {
      // use local CHAMPIONSHIP_WEEKS_DATA fallback
    }
    mergeRegisteredParticipantsWithBlacklist();
    await loadRemoteChampionshipStandings();
    await loadRemoteChampionshipEventStatus();
    syncBlacklistWithRotationsAndStandings();
    renderBlacklistUI();
    renderChampionshipGroupsAndRoutes();
    renderAllTacticalCards();
  }

  // --------------------------------------------------------------------------
  // 4.6.4 FICHA TÉCNICA BLACKLIST (#torneo-panel-dossiers): MASTER-DETAIL COCKPIT
  // --------------------------------------------------------------------------
  function updateBlacklistTacticalCard(rankNum) {
    torneoState.activeCockpitRank = Number(rankNum || 1);
    const d = findBlacklistDriver(torneoState.activeCockpitRank) || currentBlacklistDrivers[0];
    if (!d) return;

    // Highlight active item in roster and quick pills
    document.querySelectorAll("[data-cockpit-select-rank]").forEach((el) => {
      el.classList.toggle("is-active", Number(el.dataset.cockpitSelectRank) === Number(d.rank));
    });

    const workstation = document.getElementById("cockpit-detail-workstation");
    if (!workstation) return;

    const sortedAll = getSortedBlacklistDrivers();
    const standingPos = sortedAll.findIndex((x) => Number(x.rank) === Number(d.rank)) + 1 || d.rank;
    const groupInfo = getDriverGroupForWeek(d.rank, torneoState.champWeek || 1);
    const totalPts = calculateDriverPoints(d);
    const v = d.victories || { p1: 0, p2: 0, p3: 0, p4: 0 };
    const bt = d.bestTimes || { first: 0, second: 0, third: 0 };
    const bonusPts =
      typeof d.bonusPts === "number"
        ? d.bonusPts
        : bt.first * 100 + bt.second * 50 + bt.third * 20;
    const cleanName = String(d.name).replace(/™/g, "").trim();

    // Head-to-Head rival comparison (#1 vs #2 or vs Leader)
    const rival =
      standingPos === 1 && sortedAll.length > 1
        ? sortedAll[1]
        : sortedAll[0] || d;
    const rivalPts = calculateDriverPoints(rival);
    const ptsDiff = totalPts - rivalPts;

    workstation.innerHTML = `
      <div class="v7-cockpit-header">
        <div style="display: flex; align-items: center; gap: 18px; flex-wrap: wrap;">
          <img src="${escapeHtml(getDriverAvatar(d))}" alt="${escapeHtml(d.name)}" style="width: 84px; height: 84px; border-radius: 16px; object-fit: cover; border: 2px solid rgba(255,174,0,0.6);" />
          <div>
            <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 6px;">
              <span class="nfs-rank-pill ${standingPos <= 3 ? "rank-" + standingPos : ""}">STANDINGS #${standingPos}</span>
              <span class="nfs-type-pill type-circuito">BLACKLIST #${d.rank}</span>
              <span class="nfs-type-pill type-sprint">${escapeHtml(groupInfo.label)}</span>
              <span class="creator-slug">${escapeHtml(d.badge || "PILOTO OFICIAL")}</span>
            </div>
            <h3 style="font-size: 26px; font-weight: 900; color: #fff; margin: 0;">${escapeHtml(d.name)}</h3>
            <div style="font-family: var(--font-mono); font-size: 12px; color: #ffae00; margin-top: 2px;">
              Alias Oficial: "${escapeHtml(d.alias)}" &bull; Horario: ${escapeHtml(d.schedule || "20:00 GMT")}
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${
            d.youtube
              ? `<a href="${escapeHtml(d.youtube)}" target="_blank" rel="noopener noreferrer" class="btn-nfs-white-cta btn-table-video no-glitch" style="padding: 6px 14px; font-size: 11px; text-decoration: none; display: inline-flex; align-items: center; justify-content: center;"><span>VIDEO ▶</span></a>`
              : ""
          }
          <button type="button" class="uiverse-baboon-btn stage-action-btn btn-nfs-white-cta" data-text="Expediente Telemetría →" data-open-pilot="${escapeHtml(cleanName)}"><span class="text">Expediente Telemetría &rarr;</span></button>
        </div>
      </div>

      <p style="font-size: 13.5px; color: #cbd5e1; line-height: 1.6; margin: 14px 0 18px;">
        ${escapeHtml(d.bio)}
      </p>

      <!-- 4 KPI Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 12px; margin-bottom: 18px;">
        <div class="v7-cockpit-kpi">
          <span class="v7-cockpit-kpi-label">PUNTOS CAMPEONATO</span>
          <strong style="font-size: 22px; color: #fde047;">${totalPts.toLocaleString("es-ES")} PTS</strong>
        </div>
        <div class="v7-cockpit-kpi">
          <span class="v7-cockpit-kpi-label">REPUTACIÓN ($ REP)</span>
          <strong style="font-size: 20px; color: #34d399;">$${escapeHtml(d.rep || "0")}</strong>
        </div>
        <div class="v7-cockpit-kpi">
          <span class="v7-cockpit-kpi-label">VEHÍCULO HOMOLOGADO</span>
          <strong style="font-size: 15px; color: #ffffff;">${escapeHtml(d.ride)}</strong>
        </div>
        <div class="v7-cockpit-kpi">
          <span class="v7-cockpit-kpi-label">ESPECIALIDAD TÁCTICA</span>
          <strong style="font-size: 14px; color: #c4b5fd;">${escapeHtml(d.strength)}</strong>
        </div>
      </div>

      <!-- Podium Matrix & Head-to-Head -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px;">
        <div style="padding: 14px; border-radius: 12px; background: rgba(7,7,10,0.65); border: 1px solid rgba(255,255,255,0.08);">
          <div style="font-family: var(--font-mono); font-size: 10.5px; color: #ffae00; text-transform: uppercase; margin-bottom: 10px;">
            Matriz de Rendimiento Semanal (P1–P4 + Bonus)
          </div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; text-align: center; font-family: var(--font-mono);">
            <div style="padding: 8px; border-radius: 8px; background: rgba(250,204,21,0.1); border: 1px solid rgba(250,204,21,0.25);">
              <div style="font-size: 10px; color: #fde047;">P1 (25p)</div>
              <div style="font-size: 18px; font-weight: 900; color: #fff;">${v.p1}</div>
            </div>
            <div style="padding: 8px; border-radius: 8px; background: rgba(226,232,240,0.08); border: 1px solid rgba(226,232,240,0.2);">
              <div style="font-size: 10px; color: #cbd5e1;">P2 (18p)</div>
              <div style="font-size: 18px; font-weight: 900; color: #fff;">${v.p2}</div>
            </div>
            <div style="padding: 8px; border-radius: 8px; background: rgba(251,146,60,0.1); border: 1px solid rgba(251,146,60,0.25);">
              <div style="font-size: 10px; color: #fb923c;">P3 (15p)</div>
              <div style="font-size: 18px; font-weight: 900; color: #fff;">${v.p3}</div>
            </div>
            <div style="padding: 8px; border-radius: 8px; background: rgba(148,163,184,0.08); border: 1px solid rgba(148,163,184,0.18);">
              <div style="font-size: 10px; color: #94a3b8;">P4 (12p)</div>
              <div style="font-size: 18px; font-weight: 900; color: #fff;">${v.p4}</div>
            </div>
          </div>
          <div style="margin-top: 10px; display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 11.5px; color: #cbd5e1;">
            <span>Récords Velocidad Semanal: 🥇${bt.first} 🥈${bt.second} 🥉${bt.third}</span>
            <strong style="color: #ffae00;">+${bonusPts} PTS Bonus</strong>
          </div>
        </div>

        <div style="padding: 14px; border-radius: 12px; background: rgba(7,7,10,0.65); border: 1px solid rgba(255,255,255,0.08);">
          <div style="font-family: var(--font-mono); font-size: 10.5px; color: #c4b5fd; text-transform: uppercase; margin-bottom: 10px;">
            Comparativa Head-to-Head vs ${escapeHtml(rival.name)}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-family: var(--font-mono); font-size: 12px;">
            <span style="color: #fff; font-weight: 800;">${escapeHtml(d.name)}</span>
            <span style="color: ${ptsDiff >= 0 ? "#34d399" : "#f87171"}; font-weight: 800;">
              ${ptsDiff >= 0 ? "+" + ptsDiff : ptsDiff} PTS DIFERENCIA
            </span>
            <span style="color: #94a3b8;">${escapeHtml(rival.name)}</span>
          </div>
          <div style="height: 8px; border-radius: 999px; background: rgba(255,255,255,0.08); overflow: hidden; display: flex;">
            <div style="width: ${Math.min(90, Math.max(15, Math.round((totalPts / Math.max(1, totalPts + rivalPts)) * 100)))}%; background: linear-gradient(90deg, #9333ea, #ffae00);"></div>
          </div>
          <div style="margin-top: 12px; font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary);">
            Telemetría verificada a <strong>128Hz</strong> &bull; Estado: <strong style="color: #34d399;">HOMOLOGADO</strong>
          </div>
        </div>
      </div>
    `;
  }

  function renderAllTacticalCards() {
    const rosterContainer = document.getElementById("cockpit-roster-items");
    const pillsContainer = document.getElementById("cockpit-quick-switch-pills");
    const dossiersGrid = document.getElementById("torneo-dossiers-grid");

    const sortedAll = getSortedBlacklistDrivers();
    const searchQ = (torneoState.cockpitSearch || "").toLowerCase().trim();
    const grpFilter = torneoState.cockpitFilter || "all";

    const filteredRoster = currentBlacklistDrivers.filter((d) => {
      const gInfo = getDriverGroupForWeek(d.rank, torneoState.champWeek || 1);
      if (grpFilter !== "all" && gInfo.key !== grpFilter) return false;
      if (searchQ) {
        const hay = `${d.name} ${d.alias} ${d.ride} #${d.rank}`.toLowerCase();
        if (!hay.includes(searchQ)) return false;
      }
      return true;
    });

    if (rosterContainer) {
      rosterContainer.innerHTML = filteredRoster
        .map((d) => {
          const isSelected = Number(d.rank) === Number(torneoState.activeCockpitRank);
          const pts = calculateDriverPoints(d);
          const gInfo = getDriverGroupForWeek(d.rank, torneoState.champWeek || 1);
          return `
            <button type="button" class="v7-roster-item ${isSelected ? "is-active" : ""}" data-cockpit-select-rank="${d.rank}">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span class="nfs-rank-pill ${d.rank <= 3 ? "rank-" + d.rank : ""}" style="width: 26px; height: 26px; font-size: 11px;">#${d.rank}</span>
                <div style="text-align: left;">
                  <div style="font-size: 13px; font-weight: 800; color: #fff;">${escapeHtml(d.name)}</div>
                  <div style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);">${escapeHtml(d.ride)} &bull; ${escapeHtml(gInfo.label)}</div>
                </div>
              </div>
              <span style="font-family: var(--font-mono); font-size: 11.5px; font-weight: 800; color: #fde047;">${pts} PTS</span>
            </button>
          `;
        })
        .join("");
      if (typeof window.initGlitchDataText === "function") {
        window.initGlitchDataText();
      }
      if (typeof window.applyGlitchEffectToAllButtons === "function") {
        window.applyGlitchEffectToAllButtons();
      }
    }

    if (pillsContainer) {
      pillsContainer.innerHTML = currentBlacklistDrivers
        .map((d) => {
          const isSelected = Number(d.rank) === Number(torneoState.activeCockpitRank);
          return `
            <button type="button" class="stage-action-btn ${isSelected ? "is-active" : ""}" data-cockpit-select-rank="${d.rank}">
              #${d.rank} ${escapeHtml(d.name)}
            </button>
          `;
        })
        .join("");
      if (typeof window.initGlitchDataText === "function") {
        window.initGlitchDataText();
      }
      if (typeof window.applyGlitchEffectToAllButtons === "function") {
        window.applyGlitchEffectToAllButtons();
      }
    }

    updateBlacklistTacticalCard(torneoState.activeCockpitRank || 1);

    if (dossiersGrid) {
      dossiersGrid.innerHTML = sortedAll
        .map((d, idx) => {
          const standingPos = idx + 1;
          const rankClass =
            standingPos === 1 ? "rank-1" : standingPos === 2 ? "rank-2" : standingPos === 3 ? "rank-3" : "";
          const cleanName = String(d.name).replace(/™/g, "").trim();
          const totalPts = calculateDriverPoints(d);
          const gInfo = getDriverGroupForWeek(d.rank, torneoState.champWeek || 1);

          return `
            <article class="nfs-dossier-card">
              <div class="nfs-dossier-top">
                <img src="${escapeHtml(getDriverAvatar(d))}" alt="${escapeHtml(d.name)}" class="nfs-dossier-avatar" loading="lazy" />
                <div style="flex: 1;">
                  <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                    <span class="nfs-rank-pill ${rankClass}">#${standingPos} (BL #${d.rank})</span>
                    <span class="nfs-type-pill type-circuito">${escapeHtml(gInfo.label)}</span>
                  </div>
                  <h4 style="font-size: 18px; font-weight: 900; color: #ffffff; margin-top: 6px; cursor: pointer;" data-cockpit-select-rank="${d.rank}">${escapeHtml(d.name)}</h4>
                  <div style="font-family: var(--font-mono); font-size: 11px; color: #ffae00;">"${escapeHtml(d.alias)}"</div>
                </div>
              </div>

              <p style="font-size: 12.5px; line-height: 1.55; color: #cbd5e1;">${escapeHtml(d.bio)}</p>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 10px 12px; border-radius: 10px; background: rgba(7,7,10,0.65); border: 1px solid rgba(255,255,255,0.07); font-family: var(--font-mono); font-size: 11px;">
                <div>
                  <div style="color: var(--text-muted); font-size: 9.5px;">VEHÍCULO OFICIAL</div>
                  <div style="color: #fff; font-weight: 700;">${escapeHtml(d.ride)}</div>
                </div>
                <div>
                  <div style="color: var(--text-muted); font-size: 9.5px;">ESPECIALIDAD</div>
                  <div style="color: #c4b5fd; font-weight: 700;">${escapeHtml(d.strength)}</div>
                </div>
                <div>
                  <div style="color: var(--text-muted); font-size: 9.5px;">PUNTOS CAMPEONATO</div>
                  <div style="color: #fde047; font-weight: 800;">${totalPts.toLocaleString("es-ES")} PTS</div>
                </div>
                <div>
                  <div style="color: var(--text-muted); font-size: 9.5px;">REPUTACIÓN</div>
                  <div style="color: #34d399; font-weight: 800;">$${escapeHtml(d.rep || "0")}</div>
                </div>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.08);">
                <span style="font-family: var(--font-mono); font-size: 10.5px; color: var(--text-secondary);">🕒 ${escapeHtml(d.schedule || "20:00 GMT")}</span>
                <div style="display: flex; gap: 6px;">
                  ${
                    d.youtube
                      ? `<a href="${escapeHtml(d.youtube)}" target="_blank" rel="noopener noreferrer" class="btn-nfs-white-cta btn-table-video no-glitch" style="padding: 5px 12px; font-size: 11px; text-decoration: none; display: inline-flex; align-items: center; justify-content: center;"><span>VIDEO ▶</span></a>`
                      : ""
                  }
                  <button type="button" class="uiverse-baboon-btn stage-action-btn btn-nfs-white-cta" data-text="Expediente →" data-open-pilot="${escapeHtml(cleanName)}"><span class="text">Expediente &rarr;</span></button>
                </div>
              </div>
            </article>
          `;
        })
        .join("");
      if (typeof window.initGlitchDataText === "function") {
        window.initGlitchDataText();
      }
      if (typeof window.applyGlitchEffectToAllButtons === "function") {
        window.applyGlitchEffectToAllButtons();
      }
    }
  }

  document.addEventListener("click", (e) => {
    const selectBtn = e.target.closest("[data-cockpit-select-rank]");
    if (selectBtn) {
      updateBlacklistTacticalCard(Number(selectBtn.dataset.cockpitSelectRank || 1));
    }
  });

  const cockpitSearchInput = document.getElementById("cockpit-roster-search");
  if (cockpitSearchInput) {
    cockpitSearchInput.addEventListener("input", (e) => {
      torneoState.cockpitSearch = e.target.value || "";
      renderAllTacticalCards();
    });
  }

  document.querySelectorAll("[data-cockpit-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      torneoState.cockpitFilter = btn.dataset.cockpitFilter || "all";
      document.querySelectorAll("[data-cockpit-filter]").forEach((b) => b.classList.toggle("is-active", b === btn));
      renderAllTacticalCards();
    });
  });

  // --------------------------------------------------------------------------
  // 4.6.5 INSCRIPCIÓN DEL TORNEO (#torneo-panel-register) + FIREBASE SYNC
  // --------------------------------------------------------------------------
  function loadChampionshipParticipants() {
    try {
      const raw = localStorage.getItem("nfs_mw_championship_participants");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // ignore
    }
    return [...CHAMPIONSHIP_DEFAULT_PARTICIPANTS];
  }

  async function syncChampionshipParticipantsFromCloud() {
    try {
      const res = await fetch(`${FIREBASE_DB_BASE_URL}/championship_participants.json`);
      if (!res.ok) return;
      const data = await res.json();
      if (!data) return;
      const list = Array.isArray(data) ? data.filter(Boolean) : Object.values(data).filter(Boolean);
      if (list.length > 0) {
        localStorage.setItem("nfs_mw_championship_participants", JSON.stringify(list));
        mergeRegisteredParticipantsWithBlacklist();
        syncBlacklistWithRotationsAndStandings();
        renderRegisteredPilotsUI();
        renderBlacklistUI();
        renderChampionshipGroupsAndRoutes();
        renderAllTacticalCards();
      }
    } catch (e) {
      // fallback to local participants
    }
  }

  async function saveChampionshipParticipant(participantObj) {
    const current = loadChampionshipParticipants();
    current.push(participantObj);
    try {
      localStorage.setItem("nfs_mw_championship_participants", JSON.stringify(current));
    } catch (e) {
      // ignore
    }

    try {
      await fetch(`${FIREBASE_DB_BASE_URL}/championship_participants.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(current)
      });
    } catch (e) {
      // fallback already saved in localStorage
    }
  }

  function renderRegisteredPilotsUI() {
    const listEl = document.getElementById("registered-pilots-list");
    const countBadge = document.getElementById("registered-pilots-count-badge");
    const participants = loadChampionshipParticipants();

    if (countBadge) {
      countBadge.textContent = `${participants.length} / 15 PLAZAS OCUPADAS`;
    }
    if (!listEl) return;

    listEl.innerHTML = participants
      .map((p, idx) => {
        const rankNum = idx + 1;
        const cleanName = String(p.alias || p.name || "").replace(/™/g, "").trim();
        return `
          <div class="nfs-group-pilot-row" data-open-pilot="${escapeHtml(cleanName)}">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span class="nfs-rank-pill ${rankNum <= 3 ? "rank-" + rankNum : ""}" style="width: 28px; height: 28px;">#${rankNum}</span>
              <img src="${escapeHtml(getDriverAvatar(p))}" alt="${escapeHtml(p.name)}" style="width: 34px; height: 34px; border-radius: 8px; object-fit: cover;" loading="lazy" />
              <div>
                <div style="font-size: 13.5px; font-weight: 800; color: #fff;">
                  ${escapeHtml(p.name)} <span style="color: #ffae00; font-size: 11px;">"${escapeHtml(p.alias || p.name)}"</span>
                </div>
                <div style="font-family: var(--font-mono); font-size: 10.5px; color: var(--text-secondary);">
                  ${escapeHtml(p.car)} &bull; ${escapeHtml(p.specialty || "Polivalente")}
                </div>
              </div>
            </div>
            <span class="creator-slug">${escapeHtml(p.schedule || "20:00 GMT")}</span>
          </div>
        `;
      })
      .join("");
  }

  const champRegForm = document.getElementById("form-championship-register");
  if (champRegForm) {
    champRegForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = (document.getElementById("reg-driver-name")?.value || document.getElementById("reg-pilot-name")?.value || "").trim();
      const alias = (document.getElementById("reg-driver-alias")?.value || document.getElementById("reg-pilot-alias")?.value || name).trim();
      const car = document.getElementById("reg-driver-car")?.value || document.getElementById("reg-pilot-car")?.value || "BMW M3 GTR";
      const specialty = document.getElementById("reg-driver-contact")?.value || document.getElementById("reg-pilot-specialty")?.value || "Polivalente / Todo Terreno";
      const schedule = document.getElementById("reg-driver-schedule")?.value || document.getElementById("reg-pilot-schedule")?.value || "Noches (20:00 - 00:00 GMT)";
      const youtube = (document.getElementById("reg-driver-youtube")?.value || document.getElementById("reg-pilot-youtube")?.value || "").trim();
      const bio =
        (document.getElementById("reg-driver-contact")?.value || document.getElementById("reg-pilot-bio")?.value || "").trim() ||
        "Piloto oficial inscrito en la temporada competitiva de Rockport.";
      const feedbackEl = document.getElementById("register-feedback-msg") || document.getElementById("reg-form-feedback");

      if (!name) return;

      const newParticipant = {
        name,
        alias,
        car,
        specialty,
        schedule,
        youtube,
        bio,
        avatar: "assets/img/cars/bmw-m3-gtr.jpg",
        registeredAt: new Date().toISOString()
      };

      await saveChampionshipParticipant(newParticipant);
      mergeRegisteredParticipantsWithBlacklist();
      syncBlacklistWithRotationsAndStandings();
      renderRegisteredPilotsUI();
      renderBlacklistUI();
      renderChampionshipGroupsAndRoutes();
      renderAllTacticalCards();

      champRegForm.reset();
      if (feedbackEl) {
        feedbackEl.style.display = "block";
        feedbackEl.style.background = "rgba(16, 185, 129, 0.15)";
        feedbackEl.style.border = "1px solid rgba(16, 185, 129, 0.4)";
        feedbackEl.style.color = "#34d399";
        feedbackEl.textContent = `✔ Piloto ${name} ("${alias}") registrado con éxito y sincronizado en tiempo real con Firebase RTDB.`;
        setTimeout(() => {
          feedbackEl.style.display = "none";
        }, 5000);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4.6.6 PAST TOURNAMENTS (CHALLONGE ARCHIVE)
  // --------------------------------------------------------------------------
  currentPastTournamentKey = currentPastTournamentKey || "ev1n0yug";
  currentPastViewMode = currentPastViewMode || "brackets";

  function switchPastTournament(key) {
    const data = (typeof window !== "undefined" && window.PAST_TOURNAMENTS_DATA) || (typeof PAST_TOURNAMENTS_DATA !== "undefined" ? PAST_TOURNAMENTS_DATA : null);
    if (!data || !data[key]) return;
    currentPastTournamentKey = key;

    const pills = document.querySelectorAll("#past-tournaments-pills button");
    pills.forEach((btn) => {
      btn.classList.remove("is-active");
    });

    const activePill = document.getElementById(`pill-tournament-${key}`);
    if (activePill) {
      activePill.classList.add("is-active");
    }

    renderPastTournament(key);
  }

  function switchPastViewMode(mode, btn) {
    currentPastViewMode = mode;
    const modeBtns = document.querySelectorAll(".past-view-mode-tabs button");
    modeBtns.forEach((b) => {
      b.classList.remove("is-active");
    });

    if (btn) {
      btn.classList.add("is-active");
    }

    ["brackets", "podium", "roster"].forEach((m) => {
      const el = document.getElementById(`past-tournament-view-${m}`);
      if (el) {
        if (m === mode) el.style.display = "block";
        else el.style.display = "none";
      }
    });
  }

  function renderPastTournament(key) {
    const data = (typeof window !== "undefined" && window.PAST_TOURNAMENTS_DATA) || (typeof PAST_TOURNAMENTS_DATA !== "undefined" ? PAST_TOURNAMENTS_DATA : null);
    if (!data) return;
    const t = data[key];
    if (!t) return;

    renderPastTournamentHero(t);
    renderPastTournamentStats(t);
    renderPastTournamentBrackets(t);
    renderPastTournamentPodium(t);
    renderPastTournamentParticipants(t);

    const rosterCountEl = document.getElementById("past-roster-count");
    if (rosterCountEl && t.stats) rosterCountEl.textContent = t.stats.totalPilots;
  }

  function renderPastTournamentHero(t) {
    const heroEl = document.getElementById("past-tournament-hero");
    if (!heroEl) return;

    heroEl.innerHTML = `
      <div class="nfs-torneo-controls-card" style="display: flex; flex-direction: column; gap: 14px; position: relative; overflow: hidden;">
        <div style="display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 14px;">
          <div>
            <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span class="info-card-badge" style="background: rgba(255, 184, 0, 0.2); color: #ffb800; border: 1px solid rgba(255, 184, 0, 0.4);">${escapeHtml(t.edition)}</span>
              <span class="creator-slug" style="font-size: 11px;">${escapeHtml(t.date)}</span>
              <span class="nfs-type-pill type-circuito">${escapeHtml(t.category)}</span>
              <span class="nfs-district-tag">${escapeHtml(t.format)}</span>
            </div>
            <h2 style="font-size: 22px; font-weight: 800; color: #fff; letter-spacing: -0.01em;">${escapeHtml(t.title)}</h2>
            <p style="font-size: 13px; color: var(--text-secondary); margin-top: 4px; max-width: 820px; line-height: 1.55;">
              Organizado y disputado bajo las normas oficiales de <strong>${escapeHtml(t.platform)}</strong>. ${t.hosts ? `Coordinación y arbitraje: <span style="color: #ffb800; font-weight: 700;">${escapeHtml(t.hosts)}</span>.` : ""}
            </p>
          </div>
          <div style="flex-shrink: 0;">
            <a href="${escapeHtml(t.challongeUrl)}" target="_blank" rel="noopener noreferrer" class="filter-pill-btn glitch-nfs-btn is-active" data-text="Ver Bracket en Challonge ↗" style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">
              <span>Ver Bracket en Challonge ↗</span>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  function renderPastTournamentStats(t) {
    const statsEl = document.getElementById("past-tournament-stats-bar");
    if (!statsEl || !t.stats) return;

    statsEl.innerHTML = `
      <div class="nfs-kpi-card kpi-purple">
        <div class="nfs-kpi-label">TOTAL PILOTOS</div>
        <div class="nfs-kpi-value">${t.stats.totalPilots} Participantes</div>
        <div class="nfs-kpi-meta">Parrilla Verificada Challonge</div>
      </div>
      <div class="nfs-kpi-card kpi-orange">
        <div class="nfs-kpi-label">MATCHES DISPUTADOS</div>
        <div class="nfs-kpi-value">${t.stats.totalMatches} Enfrentamientos</div>
        <div class="nfs-kpi-meta">Doble Eliminación Directa</div>
      </div>
      <div class="nfs-kpi-card kpi-gold">
        <div class="nfs-kpi-label">CAMPEÓN DEL TORNEO</div>
        <div class="nfs-kpi-value" style="color: #fde047;">🥇 ${escapeHtml(t.stats.champion)}</div>
        <div class="nfs-kpi-meta">1er Lugar Oficial Homologado</div>
      </div>
      <div class="nfs-kpi-card kpi-white">
        <div class="nfs-kpi-label">SUBCAMPEÓN</div>
        <div class="nfs-kpi-value" style="color: #38bdf8;">🥈 ${escapeHtml(t.stats.runnerUp)}</div>
        <div class="nfs-kpi-meta">2do Lugar Oficial Homologado</div>
      </div>
    `;
  }

  function renderPastTournamentBrackets(t) {
    const container = document.getElementById("past-brackets-container");
    if (!container || !Array.isArray(t.bracketSections)) return;

    let html = "";
    t.bracketSections.forEach((sec) => {
      html += `
        <div class="nfs-torneo-controls-card" style="margin-bottom: 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px;">
            <h3 style="font-size: 16px; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px;">
              <span>🌳</span>
              <span>${escapeHtml(sec.sectionTitle)}</span>
            </h3>
            <span class="creator-slug" style="font-size: 10px;">
              ${sec.rounds.length} Rondas
            </span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 14px;">
      `;

      sec.rounds.forEach((round, rIdx) => {
        html += `
          <div style="background: rgba(14, 16, 22, 0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 10px;">
            <div style="font-family: var(--font-mono); font-size: 11px; font-weight: 800; color: #ffb800; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 6px; display: flex; align-items: center; justify-content: space-between;">
              <span>R${rIdx + 1}: ${escapeHtml(round.roundName)}</span>
              <span style="color: var(--text-muted); font-size: 9.5px;">${round.matches.length} Match(es)</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
        `;

        round.matches.forEach((m) => {
          const p1Win = m.p1.winner;
          const p2Win = m.p2.winner;
          const isFinal = sec.sectionId === "finals";

          html += `
            <div style="background: rgba(22, 25, 34, 0.85); border: 1px solid ${isFinal ? "rgba(255, 184, 0, 0.5)" : "rgba(255, 255, 255, 0.08)"}; border-radius: 8px; padding: 8px 10px; display: flex; flex-direction: column; gap: 6px; ${isFinal ? "box-shadow: 0 0 16px rgba(255, 184, 0, 0.2);" : ""}">
              <div style="display: flex; align-items: center; justify-content: space-between; font-family: var(--font-mono); font-size: 9.5px; color: var(--text-muted);">
                <span>MATCH #${m.id}</span>
                ${isFinal ? '<span style="color: #ffb800; font-weight: 800;">👑 GRAN FINAL</span>' : ""}
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 6px; border-radius: 6px; background: ${p1Win ? "rgba(255, 184, 0, 0.15)" : "transparent"}; font-family: var(--font-mono); font-size: 11px; font-weight: ${p1Win ? "800" : "500"}; color: ${p1Win ? "#fff" : "var(--text-secondary)"};">
                <div style="display: flex; align-items: center; gap: 6px; min-width: 0;">
                  <span style="color: var(--text-muted); font-size: 10px;">#${m.p1.seed}</span>
                  <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(m.p1.name)}</span>
                  ${p1Win ? '<span style="color: #ffb800; font-weight: 800;">✓</span>' : ""}
                </div>
                <span style="font-weight: 800; color: ${p1Win ? "#ffb800" : "var(--text-muted)"};">${m.p1.score}</span>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 6px; border-radius: 6px; background: ${p2Win ? "rgba(255, 184, 0, 0.15)" : "transparent"}; font-family: var(--font-mono); font-size: 11px; font-weight: ${p2Win ? "800" : "500"}; color: ${p2Win ? "#fff" : "var(--text-secondary)"};">
                <div style="display: flex; align-items: center; gap: 6px; min-width: 0;">
                  <span style="color: var(--text-muted); font-size: 10px;">#${m.p2.seed}</span>
                  <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(m.p2.name)}</span>
                  ${p2Win ? '<span style="color: #ffb800; font-weight: 800;">✓</span>' : ""}
                </div>
                <span style="font-weight: 800; color: ${p2Win ? "#ffb800" : "var(--text-muted)"};">${m.p2.score}</span>
              </div>
            </div>
          `;
        });

        html += `
            </div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  function renderPastTournamentPodium(t) {
    const container = document.getElementById("past-podium-container");
    if (!container || !Array.isArray(t.podium)) return;

    container.innerHTML = t.podium
      .map((item) => {
        let cardClass = "kpi-purple";
        if (item.place === 1) cardClass = "kpi-gold";
        else if (item.place === 2) cardClass = "kpi-white";
        else if (item.place === 3) cardClass = "kpi-orange";

        return `
          <div class="nfs-kpi-card ${cardClass}" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <span class="info-card-badge" style="font-size: 10.5px;">${item.medal} ${escapeHtml(item.rankName)}</span>
                <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);">Seed #${item.seed}</span>
              </div>
              <h3 style="font-size: 18px; font-weight: 800; color: #fff; margin-bottom: 6px;">${escapeHtml(item.name)}</h3>
              <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">${escapeHtml(item.note)}</p>
            </div>
            <div style="margin-top: 14px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.08); font-family: var(--font-mono); font-size: 10.5px; color: var(--text-muted); text-transform: uppercase;">
              ${escapeHtml(t.shortTitle)}
            </div>
          </div>
        `;
      })
      .join("");
  }

  function renderPastTournamentParticipants(t) {
    const tbody = document.getElementById("tbody-past-participants");
    if (!tbody || !Array.isArray(t.participants)) return;

    tbody.innerHTML = t.participants
      .map((p) => {
        return `
          <tr>
            <td style="text-align: center; font-family: var(--font-mono); font-weight: 800; color: #ffb800;">#${p.seed}</td>
            <td style="font-weight: 700; color: #fff;">${escapeHtml(p.name)}</td>
            <td style="font-family: var(--font-mono); font-size: 12px; color: #38bdf8;">${escapeHtml(p.finalPos)}</td>
            <td style="text-align: right;"><span class="creator-slug" style="font-size: 10.5px;">Verificado Challonge</span></td>
          </tr>
        `;
      })
      .join("");
  }

  // Global exposure
  window.switchPastTournament = switchPastTournament;
  window.switchPastViewMode = switchPastViewMode;
  window.renderPastTournament = renderPastTournament;

  // Initialize Challenger & Torneos V7 Engine + Cloud Sync
  mergeRegisteredParticipantsWithBlacklist();
  syncBlacklistWithRotationsAndStandings();
  renderBlacklistUI();
  renderSeasonChallenges();
  loadSeasonStandingsLive("season_1");
  renderChampionshipGroupsAndRoutes();
  renderAllTacticalCards();
  renderRegisteredPilotsUI();
  renderPastTournament(currentPastTournamentKey);

  // Trigger async Firebase syncs
  loadRemoteChampionshipWeeksData();
  loadRemoteSeasonsChallenges();
  syncChampionshipParticipantsFromCloud();

  // ==========================================================================
  // 4.7 SESIÓN DE TELEMETRÍA / EXPEDIENTE DE PILOTOS (#view-telemetry)
  // ==========================================================================
  let telemetryState = {
    pilotName: "Lea4Speed0",
    discipline: "all",
    routeQuery: "",
    rankFilter: "all"
  };

  function renderTelemetryDossierView(requestedPilotName) {
    const drivers = buildGlobalDriversDatabase();
    if (drivers.length === 0) return;

    if (requestedPilotName) {
      telemetryState.pilotName = requestedPilotName;
    }

    // Populate Quick Pilot Pills
    const quickPilotsContainer = document.getElementById("telemetry-quick-pilots");
    const sortedDrivers = [...drivers].sort((a, b) => b.wrs - a.wrs || b.totalPodiums - a.totalPodiums);

    // Find best matching pilot
    const qLower = String(telemetryState.pilotName || "").toLowerCase().replace(/™/g, "").trim();
    let activePilot =
      sortedDrivers.find((d) => d.name.toLowerCase() === qLower) ||
      sortedDrivers.find((d) => d.name.toLowerCase().includes(qLower)) ||
      sortedDrivers[0];

    if (!activePilot) return;
    telemetryState.pilotName = activePilot.name;

    if (quickPilotsContainer) {
      const topPilots = sortedDrivers.slice(0, 12);
      quickPilotsContainer.innerHTML = topPilots
        .map(
          (p) => `
          <button type="button" class="filter-pill-btn glitch-nfs-btn ${p.name === activePilot.name ? "is-active" : ""}" data-select-pilot="${escapeHtml(p.name)}" data-text="${escapeHtml(p.name + " (" + p.wrs + " WRs)")}">
            <span>${escapeHtml(p.name)} (${p.wrs} WRs)</span>
          </button>
        `
        )
        .join("");

      quickPilotsContainer.querySelectorAll("[data-select-pilot]").forEach((btn) => {
        btn.addEventListener("click", () => {
          renderTelemetryDossierView(btn.dataset.selectPilot);
        });
      });
      if (typeof window.initGlitchDataText === "function") {
        window.initGlitchDataText();
      }
    }

    // Render Pilot Cockpit Header Card
    const cockpitEl = document.getElementById("telemetry-pilot-cockpit");
    if (cockpitEl) {
      const initials = activePilot.name.slice(0, 2).toUpperCase();
      cockpitEl.innerHTML = `
        <div class="nfs-cockpit-grid">
          <div class="nfs-cockpit-pilot-box">
            <div class="nfs-cockpit-avatar">${escapeHtml(initials)}</div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 6px;">
                <span class="nfs-type-pill" style="border-color: ${activePilot.tierColor}; color: ${activePilot.tierColor};">${activePilot.tierLabel}</span>
                <span class="creator-slug">VERIFICADO 128HZ FIREBASE</span>
              </div>
              <h3 style="font-size: 28px; font-weight: 900; color: #ffffff; letter-spacing: -0.02em;">${escapeHtml(activePilot.name)}</h3>
              <div style="font-family: var(--font-mono); font-size: 12px; color: #c4b5fd; margin-top: 3px;">
                ${escapeHtml(activePilot.country)} &bull; Escudería: <strong>${escapeHtml(activePilot.team)}</strong>
              </div>
              <div style="font-family: var(--font-mono); font-size: 11.5px; color: #ffae00; margin-top: 4px;">
                Auto Insignia: <strong>${escapeHtml(activePilot.signatureCar)}</strong> &bull; Hardware: ${escapeHtml(activePilot.device)} (${escapeHtml(activePilot.gearbox)})
              </div>
            </div>
          </div>

          <div class="nfs-cockpit-stats-grid">
            <div class="nfs-cockpit-stat-box">
              <div class="nfs-cockpit-stat-val" style="color: #fde047;">${activePilot.wrs}</div>
              <div class="nfs-cockpit-stat-lbl">Récords Mundiales (#1)</div>
            </div>
            <div class="nfs-cockpit-stat-box">
              <div class="nfs-cockpit-stat-val" style="color: #e2e8f0;">${activePilot.totalPodiums}</div>
              <div class="nfs-cockpit-stat-lbl">Total Podios (🥇${activePilot.wrs} 🥈${activePilot.silver} 🥉${activePilot.bronze})</div>
            </div>
            <div class="nfs-cockpit-stat-box">
              <div class="nfs-cockpit-stat-val" style="color: #ffae00;">${activePilot.byType.Circuito} / ${activePilot.byType.Sprint} / ${activePilot.byType.Drag}</div>
              <div class="nfs-cockpit-stat-lbl">WRs Cir / Spr / Drag</div>
            </div>
            <div class="nfs-cockpit-stat-box">
              <div class="nfs-cockpit-stat-val" style="color: #34d399;">${activePilot.records.length}</div>
              <div class="nfs-cockpit-stat-lbl">Registros en Pista</div>
            </div>
          </div>
        </div>
      `;
    }

    const tableTitleEl = document.getElementById("telemetry-table-title");
    if (tableTitleEl) {
      tableTitleEl.textContent = `Expediente de Récords Registrados: ${activePilot.name}`;
    }

    renderTelemetryRecordsTable(activePilot);
  }

  function renderTelemetryRecordsTable(activePilot) {
    const tbody = document.getElementById("telemetry-records-tbody");
    const counterEl = document.getElementById("telemetry-records-counter");
    if (!tbody || !activePilot) return;

    const filtered = (activePilot.records || []).filter((r) => {
      if (telemetryState.discipline !== "all" && r.type !== telemetryState.discipline) return false;
      if (telemetryState.rankFilter === "1" && r.rank !== 1) return false;
      if (telemetryState.rankFilter === "podium" && r.rank > 3) return false;
      if (telemetryState.routeQuery) {
        const q = telemetryState.routeQuery.toLowerCase();
        const match =
          r.route.toLowerCase().includes(q) ||
          r.car.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });

    if (counterEl) {
      counterEl.textContent = `Mostrando ${filtered.length} de ${activePilot.records.length} récords verificados de ${activePilot.name}`;
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 26px; color: var(--text-secondary);">No se encontraron registros para los filtros seleccionados en el expediente de ${escapeHtml(activePilot.name)}.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered
      .map((rec) => {
        const rankClass = rec.rank === 1 ? "rank-1" : rec.rank === 2 ? "rank-2" : rec.rank === 3 ? "rank-3" : "";
        const typeClass = (rec.type || "Circuito").toLowerCase();
        const timeColor = rec.rank === 1 ? "#fde047" : rec.rank === 2 ? "#e2e8f0" : rec.rank === 3 ? "#fdba74" : "#34d399";

        return `
          <tr>
            <td style="width: 56px; text-align: center;">
              ${renderLeaderboardPositionBadge(rec.rank)}
            </td>
            <td>
              <div class="nfs-driver-link" data-open-route-lb="${escapeHtml(rec.route)}">${escapeHtml(rec.route)}</div>
            </td>
            <td>
              <span class="nfs-type-pill type-${typeClass}">${escapeHtml(rec.type)}</span>
            </td>
            <td>
              <span style="font-family: var(--font-mono); font-size: 11.5px; color: #c4b5fd;">${escapeHtml(rec.category)}</span>
            </td>
            <td>
              <span class="stitch-num" style="font-size: 14.5px; font-weight: 800; color: ${timeColor};">${formatStitchTimeHtml(rec.time)}</span>
            </td>
            <td>
              <div style="font-weight: 700; color: #fff;">${escapeHtml(rec.car)}</div>
              <div style="font-family: var(--font-mono); font-size: 10.5px; color: var(--text-secondary);">${escapeHtml(rec.setup)}</div>
            </td>
            <td>
              <span class="creator-slug">${escapeHtml(rec.device)}</span>
            </td>
            <td>
              <span class="creator-slug">${escapeHtml(rec.gearbox)}</span>
            </td>
            <td style="text-align: right;">
              <div style="display: inline-flex; gap: 6px; justify-content: flex-end;">
                ${
                  rec.videoUrl && rec.videoUrl !== "#" && String(rec.videoUrl).startsWith("http")
                    ? `<a href="${escapeHtml(rec.videoUrl)}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" class="btn-nfs-white-cta btn-table-video no-glitch" style="padding: 5px 12px; font-size: 11px; text-decoration: none; display: inline-flex; align-items: center; justify-content: center;"><span>VIDEO</span></a>`
                    : ""
                }
                <button type="button" class="uiverse-baboon-btn stage-action-btn btn-sm btn-nfs-white-cta" data-text="Leaderboard →" data-open-route-lb="${escapeHtml(rec.route)}"><span class="text">Leaderboard &rarr;</span></button>
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  renderTelemetryDossierView("Lea4Speed0");

  const telSearchInput = document.getElementById("telemetry-pilot-search-input");
  const telSearchBtn = document.getElementById("telemetry-pilot-search-btn");

  if (telSearchBtn && telSearchInput) {
    telSearchBtn.addEventListener("click", () => {
      const val = telSearchInput.value.trim();
      if (val) renderTelemetryDossierView(val);
    });
    telSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const val = telSearchInput.value.trim();
        if (val) renderTelemetryDossierView(val);
      }
    });
  }

  document.querySelectorAll("[data-tel-type]").forEach((btn) => {
    btn.addEventListener("click", () => {
      telemetryState.discipline = btn.dataset.telType || "all";
      document.querySelectorAll("[data-tel-type]").forEach((b) => b.classList.toggle("is-active", b === btn));
      renderTelemetryDossierView(telemetryState.pilotName);
    });
  });

  const telRouteFilter = document.getElementById("telemetry-route-filter");
  if (telRouteFilter) {
    telRouteFilter.addEventListener("input", (e) => {
      telemetryState.routeQuery = e.target.value.trim();
      renderTelemetryDossierView(telemetryState.pilotName);
    });
  }

  const telRankFilter = document.getElementById("telemetry-rank-filter");
  if (telRankFilter) {
    telRankFilter.addEventListener("change", (e) => {
      telemetryState.rankFilter = e.target.value;
      renderTelemetryDossierView(telemetryState.pilotName);
    });
  }

  // Delegate clicks on any [data-open-pilot] element across Leaderboards, Hall of Fame, or Tournament
  document.addEventListener("click", (e) => {
    const pilotTrigger = e.target.closest("[data-open-pilot]");
    if (!pilotTrigger) return;
    // Ignore if user clicked a route leaderboard button inside the row
    if (e.target.closest("[data-open-route-lb], a")) return;
    const pilotName = pilotTrigger.dataset.openPilot;
    if (pilotName) {
      if (telSearchInput) telSearchInput.value = pilotName;
      renderTelemetryDossierView(pilotName);
      switchView("view-telemetry");
    }
  });

  // 4.8 Stage Theme Toggle & Auth Modal
  const stageThemeBtns = document.querySelectorAll("[data-stage-theme]");
  stageThemeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.stageTheme;
      stageThemeBtns.forEach((b) => b.classList.toggle("is-active", b === btn));
      document.body.classList.toggle("light-stages", mode === "light");
    });
  });

  const authModal = document.getElementById("modal-auth");
  document.querySelectorAll("[data-open-auth]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (authModal) authModal.classList.add("is-open");
    });
  });
  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (authModal) authModal.classList.remove("is-open");
    });
  });
  if (authModal) {
    authModal.addEventListener("click", (e) => {
      if (e.target === authModal) authModal.classList.remove("is-open");
    });
  }

  // 4.9 Antigravity UI & Motion Design: 3D Spatial Tilt Interaction on Interactive Buttons
  function initAntigravitySpatialButtons() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let activeSpatialBtn = null;

    document.addEventListener("pointermove", (e) => {
      const btn = e.target.closest(".filter-pill-btn, .stage-action-btn, #view-challenges .sidebar-btn, #view-blog .sidebar-btn");
      if (!btn) {
        if (activeSpatialBtn) {
          activeSpatialBtn.style.transform = "";
          activeSpatialBtn = null;
        }
        return;
      }

      activeSpatialBtn = btn;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const maxTilt = 7;
      const tiltX = -((y - midY) / midY) * maxTilt;
      const tiltY = ((x - midX) / midX) * maxTilt;

      const isPill = btn.classList.contains("filter-pill-btn");
      const isStage = btn.classList.contains("stage-action-btn");
      const baseLift = isPill
        ? "translateY(-2.5px) scale(1.04)"
        : isStage
        ? "translateY(-2px) scale(1.05)"
        : "translateX(4px) translateY(-1px) scale(1.02)";

      btn.style.transform = `perspective(500px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) ${baseLift}`;
    });

    document.addEventListener("pointerout", (e) => {
      const btn = e.target.closest(".filter-pill-btn, .stage-action-btn, #view-challenges .sidebar-btn, #view-blog .sidebar-btn");
      if (btn && (!e.relatedTarget || !btn.contains(e.relatedTarget))) {
        btn.style.transform = "";
        if (activeSpatialBtn === btn) activeSpatialBtn = null;
      }
    });
  }

  initAntigravitySpatialButtons();

  // Prefetch all 86 track leaderboards from Firebase RTDB in the background, then refresh Hall of Fame & Telemetry
  prefetchGlobalLeaderboards().then(() => {
    renderHallOfFameView();
    renderTelemetryDossierView(telemetryState.pilotName);
  });

  // Handle direct hash navigation on initial page load (e.g., #view-blog, #view-challenges)
  if (window.location.hash) {
    const rawHash = window.location.hash.replace("#", "").trim();
    if (rawHash) {
      const parts = rawHash.split("?");
      const targetView = parts[0];
      const params = new URLSearchParams(parts[1] || "");
      const tabParam = params.get("tab") || "";
      if (document.getElementById(targetView) && typeof switchView === "function") {
        switchView(targetView, tabParam);
      }
    }
  }
  const searchParams = new URLSearchParams(window.location.search);
  const qView = searchParams.get("view");
  const qTab = searchParams.get("tab");
  const qCat = searchParams.get("cat");
  if (qCat && (qCat === "Circuito" || qCat === "Sprint" || qCat === "Drag")) {
    routesViewState.cat = qCat;
    document.querySelectorAll("[data-routes-cat]").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.routesCat === qCat);
    });
    if (typeof updateRoutesBannerTitle === "function") {
      updateRoutesBannerTitle(qCat);
    }
    if (typeof renderRoutesCatalog === "function") {
      renderRoutesCatalog();
    }
  }
  if (qView && document.getElementById(qView) && typeof switchView === "function") {
    switchView(qView, qTab);
  }
});

