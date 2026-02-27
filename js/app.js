// =========================================
// SC Cargo Hauler — Main application logic
// =========================================

(function () {
  "use strict";

  // --------------- State ---------------
  let maxScu = 0;
  let contracts = [];
  let history = loadHistory();

  // --------------- DOM refs ---------------
  const shipSelect = document.getElementById("ship-select");
  const customScuInput = document.getElementById("custom-scu");
  const shipCapacity = document.getElementById("ship-capacity");
  const maxScuDisplay = document.getElementById("max-scu-display");

  const cargoAlert = document.getElementById("cargo-alert");
  const alertMessage = document.getElementById("alert-message");

  const contractBody = document.getElementById("contract-body");
  const noContracts = document.getElementById("no-contracts");
  const contractTable = document.getElementById("contract-table");

  const btnAdd = document.getElementById("btn-add-contract");
  const btnComplete = document.getElementById("btn-complete-run");
  const btnClear = document.getElementById("btn-clear-run");
  const btnClearHistory = document.getElementById("btn-clear-history");

  // Form inputs
  const fCommodity = document.getElementById("contract-commodity");
  const fCommodityCustom = document.getElementById("contract-commodity-custom");
  const fScu = document.getElementById("contract-scu");
  const fPayout = document.getElementById("contract-payout");
  const fPickup = document.getElementById("contract-pickup");
  const fPickupCustom = document.getElementById("contract-pickup-custom");
  const fDropoff = document.getElementById("contract-dropoff");
  const fDropoffCustom = document.getElementById("contract-dropoff-custom");
  const fDistance = document.getElementById("contract-distance");

  // Summary elements
  const runSummary = document.getElementById("run-summary");
  const statContracts = document.getElementById("stat-contracts");
  const statScu = document.getElementById("stat-scu");
  const statRemaining = document.getElementById("stat-remaining");
  const statPayout = document.getElementById("stat-payout");
  const statUecScu = document.getElementById("stat-uec-scu");
  const statUecKm = document.getElementById("stat-uec-km");
  const statDistance = document.getElementById("stat-distance");
  const statDropoffs = document.getElementById("stat-dropoffs");
  const usagePercent = document.getElementById("usage-percent");
  const usageFill = document.getElementById("usage-fill");

  // History elements
  const historyList = document.getElementById("history-list");
  const noHistory = document.getElementById("no-history");
  const historyAnalysis = document.getElementById("history-analysis");

  // --------------- Init ---------------
  populateSelects();
  renderHistory();
  restoreCurrentRun();

  // --------------- Populate dropdowns ---------------
  function populateSelects() {
    SHIPS.forEach(function (ship) {
      const opt = document.createElement("option");
      opt.value = ship.scu;
      opt.textContent = ship.name + " (" + ship.scu + " SCU)";
      shipSelect.appendChild(opt);
    });

    COMMODITIES.forEach(function (c) {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      fCommodity.appendChild(opt);
    });

    [fPickup, fDropoff].forEach(function (sel) {
      LOCATIONS.forEach(function (loc) {
        const opt = document.createElement("option");
        opt.value = loc;
        opt.textContent = loc;
        sel.appendChild(opt);
      });
    });
  }

  // --------------- Ship selection ---------------
  shipSelect.addEventListener("change", function () {
    if (shipSelect.value) {
      maxScu = parseInt(shipSelect.value, 10);
      customScuInput.value = "";
    } else {
      maxScu = 0;
    }
    onShipChanged();
  });

  customScuInput.addEventListener("input", function () {
    if (customScuInput.value) {
      maxScu = parseInt(customScuInput.value, 10) || 0;
      shipSelect.value = "";
    } else {
      maxScu = 0;
    }
    onShipChanged();
  });

  function onShipChanged() {
    if (maxScu > 0) {
      shipCapacity.classList.remove("hidden");
      maxScuDisplay.textContent = maxScu.toLocaleString();
    } else {
      shipCapacity.classList.add("hidden");
    }
    updateSummary();
    saveCurrentRun();
  }

  // --------------- Add contract ---------------
  btnAdd.addEventListener("click", addContract);

  function addContract() {
    var commodity = fCommodityCustom.value.trim() || fCommodity.value;
    var scu = parseInt(fScu.value, 10);
    var payout = parseInt(fPayout.value, 10) || 0;
    var pickup = fPickupCustom.value.trim() || fPickup.value;
    var dropoff = fDropoffCustom.value.trim() || fDropoff.value;
    var distance = parseFloat(fDistance.value) || 0;

    if (!commodity) {
      flash(fCommodity);
      return;
    }
    if (!scu || scu < 1) {
      flash(fScu);
      return;
    }

    contracts.push({
      id: Date.now() + Math.random(),
      commodity: commodity,
      scu: scu,
      payout: payout,
      pickup: pickup || "—",
      dropoff: dropoff || "—",
      distance: distance,
    });

    clearForm();
    renderContracts();
    updateSummary();
    saveCurrentRun();
  }

  function flash(el) {
    el.style.borderColor = "var(--accent-red)";
    setTimeout(function () {
      el.style.borderColor = "";
    }, 1200);
  }

  function clearForm() {
    fCommodity.value = "";
    fCommodityCustom.value = "";
    fScu.value = "";
    fPayout.value = "";
    fPickup.value = "";
    fPickupCustom.value = "";
    fDropoff.value = "";
    fDropoffCustom.value = "";
    fDistance.value = "";
  }

  // --------------- Remove contract ---------------
  function removeContract(id) {
    contracts = contracts.filter(function (c) {
      return c.id !== id;
    });
    renderContracts();
    updateSummary();
    saveCurrentRun();
  }

  // --------------- Render contracts ---------------
  function renderContracts() {
    contractBody.innerHTML = "";

    if (contracts.length === 0) {
      noContracts.classList.remove("hidden");
      contractTable.classList.add("hidden");
      return;
    }

    noContracts.classList.add("hidden");
    contractTable.classList.remove("hidden");

    contracts.forEach(function (c) {
      var tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" + esc(c.commodity) + "</td>" +
        "<td>" + c.scu + "</td>" +
        "<td>" + esc(c.pickup) + "</td>" +
        "<td>" + esc(c.dropoff) + "</td>" +
        "<td>" + c.payout.toLocaleString() + " UEC</td>" +
        "<td>" + (c.distance ? c.distance.toLocaleString() : "—") + "</td>" +
        '<td><button class="btn-remove" title="Remove">&times;</button></td>';

      tr.querySelector(".btn-remove").addEventListener("click", function () {
        removeContract(c.id);
      });

      contractBody.appendChild(tr);
    });
  }

  // --------------- Update summary ---------------
  function updateSummary() {
    if (contracts.length === 0) {
      runSummary.classList.add("hidden");
      cargoAlert.classList.add("hidden");
      btnComplete.disabled = true;
      btnClear.disabled = true;
      return;
    }

    runSummary.classList.remove("hidden");
    btnComplete.disabled = false;
    btnClear.disabled = false;

    var totalScu = 0;
    var totalPayout = 0;
    var totalDistance = 0;
    var hasDistance = false;
    var dropoffs = {};

    contracts.forEach(function (c) {
      totalScu += c.scu;
      totalPayout += c.payout;
      if (c.distance > 0) {
        totalDistance += c.distance;
        hasDistance = true;
      }
      if (c.dropoff && c.dropoff !== "—") {
        dropoffs[c.dropoff] = true;
      }
    });

    var remaining = maxScu > 0 ? maxScu - totalScu : 0;
    var uecPerScu = totalScu > 0 ? (totalPayout / totalScu).toFixed(1) : "—";
    var uecPerKm = hasDistance && totalDistance > 0 ? (totalPayout / totalDistance).toFixed(1) : "—";

    statContracts.textContent = contracts.length;
    statScu.textContent = totalScu.toLocaleString();
    statRemaining.textContent = maxScu > 0 ? remaining.toLocaleString() : "—";
    statPayout.textContent = totalPayout.toLocaleString() + " UEC";
    statUecScu.textContent = uecPerScu !== "—" ? uecPerScu + " UEC" : "—";
    statUecKm.textContent = uecPerKm !== "—" ? uecPerKm + " UEC" : "—";
    statDistance.textContent = hasDistance ? totalDistance.toLocaleString() + " km" : "—";
    statDropoffs.textContent = Object.keys(dropoffs).length;

    // Color remaining SCU if negative
    if (maxScu > 0 && remaining < 0) {
      statRemaining.classList.add("over");
    } else {
      statRemaining.classList.remove("over");
    }

    // Usage bar
    if (maxScu > 0) {
      var pct = Math.min((totalScu / maxScu) * 100, 100);
      usageFill.style.width = pct + "%";
      usagePercent.textContent = Math.round((totalScu / maxScu) * 100) + "%";

      usageFill.classList.remove("warn", "over");
      if (totalScu > maxScu) {
        usageFill.classList.add("over");
      } else if (pct >= 85) {
        usageFill.classList.add("warn");
      }
    } else {
      usageFill.style.width = "0%";
      usagePercent.textContent = "—";
    }

    // Alert
    if (maxScu > 0 && totalScu > maxScu) {
      var overBy = totalScu - maxScu;
      alertMessage.textContent =
        "Cargo limit exceeded by " + overBy + " SCU! " +
        "(" + totalScu + " / " + maxScu + " SCU)";
      cargoAlert.className = "alert alert-over";
    } else if (maxScu > 0 && totalScu >= maxScu * 0.9) {
      alertMessage.textContent =
        "Approaching cargo limit: " + totalScu + " / " + maxScu + " SCU (" +
        (maxScu - totalScu) + " remaining)";
      cargoAlert.className = "alert alert-warn";
    } else {
      cargoAlert.classList.add("hidden");
    }
  }

  // --------------- Complete run ---------------
  btnComplete.addEventListener("click", function () {
    if (contracts.length === 0) return;

    var totalScu = 0;
    var totalPayout = 0;
    var totalDistance = 0;

    contracts.forEach(function (c) {
      totalScu += c.scu;
      totalPayout += c.payout;
      totalDistance += c.distance || 0;
    });

    var shipName = "";
    if (shipSelect.value) {
      shipName = shipSelect.options[shipSelect.selectedIndex].textContent;
    } else if (maxScu > 0) {
      shipName = "Custom (" + maxScu + " SCU)";
    } else {
      shipName = "Unknown Ship";
    }

    var run = {
      id: Date.now(),
      date: new Date().toISOString(),
      ship: shipName,
      maxScu: maxScu,
      contracts: contracts.slice(),
      totalScu: totalScu,
      totalPayout: totalPayout,
      totalDistance: totalDistance,
    };

    history.unshift(run);
    saveHistory();
    renderHistory();

    // Clear current run
    contracts = [];
    renderContracts();
    updateSummary();
    clearCurrentRun();
  });

  // --------------- Clear run ---------------
  btnClear.addEventListener("click", function () {
    if (contracts.length === 0) return;
    contracts = [];
    renderContracts();
    updateSummary();
    clearCurrentRun();
  });

  // --------------- History ---------------
  function renderHistory() {
    // Remove existing entries (keep #no-history)
    var entries = historyList.querySelectorAll(".history-entry");
    entries.forEach(function (el) {
      el.remove();
    });

    if (history.length === 0) {
      noHistory.classList.remove("hidden");
      historyAnalysis.classList.add("hidden");
      return;
    }

    noHistory.classList.add("hidden");
    historyAnalysis.classList.remove("hidden");

    history.forEach(function (run) {
      var entry = document.createElement("div");
      entry.className = "history-entry";

      var dateStr = new Date(run.date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      var uecPerScu = run.totalScu > 0 ? (run.totalPayout / run.totalScu).toFixed(1) : "—";
      var uecPerKm = run.totalDistance > 0 ? (run.totalPayout / run.totalDistance).toFixed(1) : "—";

      entry.innerHTML =
        '<div class="history-entry-header">' +
          '<span class="run-ship">' + esc(run.ship) + '</span>' +
          '<span class="run-date">' + dateStr + '</span>' +
        '</div>' +
        '<div class="history-entry-stats">' +
          '<span>Contracts: <strong>' + run.contracts.length + '</strong></span>' +
          '<span>SCU: <strong>' + run.totalScu.toLocaleString() + '</strong></span>' +
          '<span>Payout: <strong>' + run.totalPayout.toLocaleString() + ' UEC</strong></span>' +
          '<span>UEC/SCU: <strong>' + uecPerScu + '</strong></span>' +
          '<span>UEC/km: <strong>' + uecPerKm + '</strong></span>' +
        '</div>' +
        '<button class="history-toggle">Details</button>' +
        '<div class="history-details">' +
          buildHistoryTable(run.contracts) +
        '</div>';

      var toggleBtn = entry.querySelector(".history-toggle");
      var details = entry.querySelector(".history-details");
      toggleBtn.addEventListener("click", function () {
        details.classList.toggle("open");
        toggleBtn.textContent = details.classList.contains("open") ? "Hide" : "Details";
      });

      historyList.appendChild(entry);
    });

    // Lifetime stats
    updateLifetimeStats();
  }

  function buildHistoryTable(contracts) {
    var html =
      '<table><thead><tr>' +
        '<th>Commodity</th><th>SCU</th><th>Pickup</th><th>Drop-off</th><th>Payout</th><th>Dist</th>' +
      '</tr></thead><tbody>';

    contracts.forEach(function (c) {
      html +=
        '<tr>' +
          '<td>' + esc(c.commodity) + '</td>' +
          '<td>' + c.scu + '</td>' +
          '<td>' + esc(c.pickup) + '</td>' +
          '<td>' + esc(c.dropoff) + '</td>' +
          '<td>' + c.payout.toLocaleString() + ' UEC</td>' +
          '<td>' + (c.distance ? c.distance.toLocaleString() + ' km' : '—') + '</td>' +
        '</tr>';
    });

    html += '</tbody></table>';
    return html;
  }

  function updateLifetimeStats() {
    if (history.length === 0) return;

    var totalRuns = history.length;
    var totalUec = 0;
    var totalScu = 0;
    var bestUec = 0;

    history.forEach(function (run) {
      totalUec += run.totalPayout;
      totalScu += run.totalScu;
      if (run.totalPayout > bestUec) bestUec = run.totalPayout;
    });

    document.getElementById("hist-runs").textContent = totalRuns;
    document.getElementById("hist-uec").textContent = totalUec.toLocaleString() + " UEC";
    document.getElementById("hist-scu").textContent = totalScu.toLocaleString();
    document.getElementById("hist-avg-uec").textContent =
      totalRuns > 0 ? Math.round(totalUec / totalRuns).toLocaleString() + " UEC" : "—";
    document.getElementById("hist-avg-uec-scu").textContent =
      totalScu > 0 ? (totalUec / totalScu).toFixed(1) + " UEC" : "—";
    document.getElementById("hist-best").textContent = bestUec.toLocaleString() + " UEC";
  }

  // Clear history
  btnClearHistory.addEventListener("click", function () {
    if (history.length === 0) return;
    history = [];
    saveHistory();
    renderHistory();
  });

  // --------------- Persistence (localStorage) ---------------
  function saveHistory() {
    try {
      localStorage.setItem("sc-hauler-history", JSON.stringify(history));
    } catch (e) {
      // storage full or unavailable
    }
  }

  function loadHistory() {
    try {
      var data = localStorage.getItem("sc-hauler-history");
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCurrentRun() {
    try {
      localStorage.setItem("sc-hauler-current", JSON.stringify({
        maxScu: maxScu,
        shipValue: shipSelect.value,
        contracts: contracts,
      }));
    } catch (e) {
      // ignore
    }
  }

  function clearCurrentRun() {
    try {
      localStorage.removeItem("sc-hauler-current");
    } catch (e) {
      // ignore
    }
  }

  function restoreCurrentRun() {
    try {
      var data = localStorage.getItem("sc-hauler-current");
      if (!data) return;
      var state = JSON.parse(data);

      if (state.shipValue) {
        shipSelect.value = state.shipValue;
        maxScu = parseInt(state.shipValue, 10);
      } else if (state.maxScu) {
        customScuInput.value = state.maxScu;
        maxScu = state.maxScu;
      }

      if (state.contracts && state.contracts.length > 0) {
        contracts = state.contracts;
      }

      onShipChanged();
      renderContracts();
      updateSummary();
    } catch (e) {
      // ignore corrupt data
    }
  }

  // --------------- Helpers ---------------
  function esc(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
})();
