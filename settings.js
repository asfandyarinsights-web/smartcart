// ---------- CONSTANTS ----------
const SETTINGS_KEY = "smartcart:settings";
const ITEMS_KEY = "smartcart:items";
const BUDGET_KEY = "smartcart:budget";
const HISTORY_KEY = "smartcart:history";

const DEFAULT_SETTINGS = { theme: "light", currency: "Rs", budgetWarnAt: 80 };

// ---------- STATE ----------
let settings = { ...DEFAULT_SETTINGS, ...loadJSON(SETTINGS_KEY, {}) };

// ---------- ELEMENTS ----------
const el = (id) => document.getElementById(id);

const themeSwitch = el("themeSwitch");
const currencySelect = el("currencySelect");
const warnInput = el("warnInput");

const exportBtn = el("exportBtn");
const importBtn = el("importBtn");
const importFile = el("importFile");
const clearDataBtn = el("clearDataBtn");
const clearConfirm = el("clearConfirm");
const clearCancel = el("clearCancel");
const clearConfirmBtn = el("clearConfirmBtn");

const toast = el("toast");
const toastMsg = el("toastMsg");
const toastUndo = el("toastUndo");

// ---------- STORAGE ----------
function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function saveJSON(key, value) {
  if (value === null || value === undefined) localStorage.removeItem(key);
  else localStorage.setItem(key, JSON.stringify(value));
}
function saveSettings() {
  saveJSON(SETTINGS_KEY, settings);
}

// ---------- TOAST ----------
let toastTimer = null;
function showToast(message) {
  clearTimeout(toastTimer);
  toastMsg.textContent = message;
  toastUndo.classList.add("hidden");
  toast.classList.remove("hidden");
  toastTimer = setTimeout(() => toast.classList.add("hidden"), 3500);
}

// ---------- INIT FORM FROM SETTINGS ----------
function applyThemeButtons() {
  themeSwitch.querySelectorAll(".theme-option").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.theme === settings.theme);
  });
}
document.documentElement.setAttribute("data-theme", settings.theme === "dark" ? "dark" : "light");
applyThemeButtons();
currencySelect.value = settings.currency;
warnInput.value = settings.budgetWarnAt;

// ---------- THEME ----------
themeSwitch.addEventListener("click", (e) => {
  const btn = e.target.closest(".theme-option");
  if (!btn) return;
  settings.theme = btn.dataset.theme;
  document.documentElement.setAttribute("data-theme", settings.theme);
  applyThemeButtons();
  saveSettings();
});

// ---------- CURRENCY ----------
currencySelect.addEventListener("change", () => {
  settings.currency = currencySelect.value;
  saveSettings();
  showToast(`Currency set to ${settings.currency}`);
});

// ---------- BUDGET THRESHOLD ----------
warnInput.addEventListener("change", () => {
  let value = parseInt(warnInput.value, 10);
  if (isNaN(value)) value = DEFAULT_SETTINGS.budgetWarnAt;
  value = Math.min(Math.max(value, 10), 99);
  warnInput.value = value;
  settings.budgetWarnAt = value;
  saveSettings();
  showToast(`Budget warning set to ${value}%`);
});

// ---------- EXPORT ----------
exportBtn.addEventListener("click", () => {
  const backup = {
    exportedAt: new Date().toISOString(),
    items: loadJSON(ITEMS_KEY, []),
    budget: loadJSON(BUDGET_KEY, null),
    history: loadJSON(HISTORY_KEY, []),
    settings,
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `smartcart-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast("Backup downloaded");
});

// ---------- IMPORT ----------
importBtn.addEventListener("click", () => importFile.click());
importFile.addEventListener("change", () => {
  const file = importFile.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!Array.isArray(data.items) || !Array.isArray(data.history)) {
        throw new Error("Missing expected fields");
      }
      saveJSON(ITEMS_KEY, data.items);
      saveJSON(BUDGET_KEY, data.budget ?? null);
      saveJSON(HISTORY_KEY, data.history);
      if (data.settings) {
        settings = { ...DEFAULT_SETTINGS, ...data.settings };
        saveSettings();
      }
      showToast("Backup restored — reloading…");
      setTimeout(() => location.reload(), 900);
    } catch {
      showToast("That file doesn't look like a SmartCart backup");
    }
  };
  reader.readAsText(file);
  importFile.value = "";
});

// ---------- CLEAR ALL DATA ----------
clearDataBtn.addEventListener("click", () => {
  clearConfirm.classList.remove("hidden");
});
clearCancel.addEventListener("click", () => {
  clearConfirm.classList.add("hidden");
});
clearConfirmBtn.addEventListener("click", () => {
  localStorage.removeItem(ITEMS_KEY);
  localStorage.removeItem(BUDGET_KEY);
  localStorage.removeItem(HISTORY_KEY);
  clearConfirm.classList.add("hidden");
  showToast("All shopping data cleared");
});
