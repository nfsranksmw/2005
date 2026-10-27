/**
 * NFSMW Online Web Controller (WebGL 2.0 / WebGPU Cloud Engine)
 * Controls interactions, server launchers, and connects seamlessly with https://web.nfsmwo.com/
 */

(function () {
  const OFFICIAL_WEB_URL = "https://web.nfsmwo.com/";

  function openOfficialGame(serverParam) {
    let url = OFFICIAL_WEB_URL;
    if (serverParam) {
      url += "?server=" + encodeURIComponent(serverParam);
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function initNfsmwoLauncher() {
    const modal = document.getElementById("gameLauncherModal");
    const btnPlay = document.getElementById("btnPlayOnline");
    const btnSingle = document.getElementById("btnSinglePlayer");
    const btnDirect = document.getElementById("btnLaunchDirect");
    const btnQuickMatch = document.getElementById("btnQuickMatch");
    const btnClose = document.getElementById("btnCloseModal");
    const btnCancel = document.getElementById("btnCancelLoad");
    const progressBar = document.getElementById("loadProgressBar");
    const statusText = document.getElementById("loadStatusText");
    const percentText = document.getElementById("loadPercentText");
    const btnCopyRef = document.getElementById("btnCopyReferral");

    let progressInterval = null;

    function openLauncher(autoRedirect = true) {
      if (!modal) {
        openOfficialGame();
        return;
      }
      modal.classList.remove("is-hidden");
      let current = 20;
      if (progressBar) progressBar.style.width = current + "%";
      if (percentText) percentText.textContent = current + "%";
      if (statusText) statusText.textContent = "CARGANDO MOTOR WASM Y COMPILANDO SHADERS...";

      clearInterval(progressInterval);
      progressInterval = setInterval(() => {
        if (current >= 100) {
          clearInterval(progressInterval);
          if (statusText) statusText.textContent = "¡TODO LISTO! ENTRANDO A ROCKPORT CITY...";
          if (percentText) percentText.textContent = "100%";
          setTimeout(() => {
            if (statusText) statusText.textContent = "INICIANDO SESIÓN WEBGL EN PANTALLA COMPLETA...";
            if (autoRedirect) {
              setTimeout(() => {
                openOfficialGame();
                closeLauncher();
              }, 700);
            }
          }, 500);
        } else {
          current += Math.floor(Math.random() * 18) + 8;
          if (current > 100) current = 100;
          if (progressBar) progressBar.style.width = current + "%";
          if (percentText) percentText.textContent = current + "%";
          if (statusText) {
            if (current > 45 && current < 75) {
              statusText.textContent = "DESEMPAQUETANDO TEXTURAS SHADER (ASSETS/MAPS.WASM)...";
            } else if (current >= 75) {
              statusText.textContent = "SINCRONIZANDO FÍSICAS DE POLICÍA (RPD-SYNC 128Hz)...";
            }
          }
        }
      }, 260);
    }

    function closeLauncher() {
      if (progressInterval) clearInterval(progressInterval);
      if (modal) modal.classList.add("is-hidden");
    }

    if (btnPlay) {
      btnPlay.addEventListener("click", (e) => {
        e.preventDefault();
        openLauncher(true);
      });
    }

    if (btnDirect) {
      btnDirect.addEventListener("click", (e) => {
        e.preventDefault();
        openLauncher(true);
      });
    }

    if (btnQuickMatch) {
      btnQuickMatch.addEventListener("click", (e) => {
        e.preventDefault();
        openOfficialGame("quickmatch");
      });
    }

    if (btnSingle) {
      btnSingle.addEventListener("click", (e) => {
        e.preventDefault();
        openOfficialGame("story");
      });
    }

    if (btnClose) btnClose.addEventListener("click", closeLauncher);
    if (btnCancel) btnCancel.addEventListener("click", closeLauncher);

    // Join Server buttons
    document.querySelectorAll(".btn-join-mwo-server").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const sName = btn.getAttribute("data-server-name") || "default";
        openOfficialGame(sName);
      });
    });

    // Test Drive buttons
    document.querySelectorAll(".btn-testdrive-car").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const carName = btn.getAttribute("data-car-name") || "m3gtr";
        openOfficialGame("testdrive_" + carName);
      });
    });

    // Copy Referral Link
    if (btnCopyRef) {
      btnCopyRef.addEventListener("click", () => {
        const link = "https://web.nfsmwo.com/?ref=MWSPEED-8921";
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(link).then(() => {
            const originalText = btnCopyRef.textContent;
            btnCopyRef.textContent = "¡LINK COPIADO!";
            btnCopyRef.style.background = "#10b981";
            btnCopyRef.style.color = "#ffffff";
            setTimeout(() => {
              btnCopyRef.textContent = originalText;
              btnCopyRef.style.background = "";
              btnCopyRef.style.color = "";
            }, 2500);
          });
        } else {
          prompt("Copia el siguiente link para invitar a tus amigos:", link);
        }
      });
    }

    // Language Selector inside section
    const langSel = document.getElementById("mwoLangSelect");
    if (langSel && typeof changeLanguage === "function") {
      langSel.addEventListener("change", (e) => {
        const val = e.target.value;
        if (val === "es" || val === "en") {
          changeLanguage(val);
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNfsmwoLauncher);
  } else {
    initNfsmwoLauncher();
  }
})();
