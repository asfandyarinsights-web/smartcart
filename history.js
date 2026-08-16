// ---------- CONSTANTS ----------
const HISTORY_KEY = "smartcart:history";

const CATEGORY_LABEL = {
  grocery: "🥕 Grocery",
  home: "🏠 Home",
  clothing: "🥼 Clothing",
  health: "💊 Health",
  electronics: "⚡ Electronics",
};

// ---------- STATE ----------
let history = loadJSON(HISTORY_KEY, []);
let currentSort = "newest";

// ---------- ELEMENTS ----------
const el = (id) => document.getElementById(id);

const statTrips = el("statTrips");
const statItems = el("statItems");
const statAverage = el("statAverage");
const statLifetime = el("statLifetime");

const searchInput = el("searchInput");
const sortSelect = el("sortSelect");

const tripCount = el("tripCount");
const tripList = el("tripList");
const emptyState = el("emptyState");
const noResults = el("noResults");
const clearHistoryBtn = el("clearHistoryBtn");

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

// ---------- FORMAT ----------
function money(n) {
  return `Rs ${Math.round(n).toLocaleString()}`;
}
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) +
    " · " + d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

// ---------- TOAST ----------
let toastTimer = null;
function showToast(message, onUndo) {
  clearTimeout(toastTimer);
  toastMsg.textContent = message;
  toast.classList.remove("hidden");
  if (onUndo) {
    toastUndo.classList.remove("hidden");
    toastUndo.onclick = () => {
      onUndo();
      toast.classList.add("hidden");
      clearTimeout(toastTimer);
    };
  } else {
    toastUndo.classList.add("hidden");
    toastUndo.onclick = null;
  }
  toastTimer = setTimeout(() => toast.classList.add("hidden"), 4000);
}

// ---------- SEARCH / SORT ----------
searchInput.addEventListener("input", renderTrips);
sortSelect.addEventListener("change", () => {
  currentSort = sortSelect.value;
  renderTrips();
});

// ---------- CLEAR HISTORY ----------
clearHistoryBtn.addEventListener("click", () => {
  if (history.length === 0) {
    showToast("History is already empty");
    return;
  }
  const backup = history;
  history = [];
  saveJSON(HISTORY_KEY, history);
  render();
  showToast(`${backup.length} trip(s) cleared`, () => {
    history = backup;
    saveJSON(HISTORY_KEY, history);
    render();
  });
});

// ---------- DERIVED STATS ----------
function computeLifetimeStats() {
  const trips = history.length;
  const totalSpent = history.reduce((sum, t) => sum + t.total, 0);
  const totalItems = history.reduce((sum, t) => sum + t.items.length, 0);
  const average = trips === 0 ? 0 : totalSpent / trips;
  return { trips, totalSpent, totalItems, average };
}

function renderStats() {
  const s = computeLifetimeStats();
  statTrips.textContent = s.trips;
  statItems.textContent = s.totalItems;
  statAverage.textContent = money(s.average);
  statLifetime.textContent = money(s.totalSpent);
}

// ---------- FILTER / SORT TRIPS ----------
function getVisibleTrips() {
  const query = searchInput.value.trim().toLowerCase();

  let list = history
    .map((trip) => {
      if (!query) return trip;
      const matches = trip.items.filter((i) => i.name.toLowerCase().includes(query));
      return matches.length > 0 ? { ...trip, items: matches } : null;
    })
    .filter(Boolean);

  list = [...list].sort((a, b) => {
    if (currentSort === "newest") return new Date(b.date) - new Date(a.date);
    if (currentSort === "oldest") return new Date(a.date) - new Date(b.date);
    if (currentSort === "highest") return b.total - a.total;
    if (currentSort === "lowest") return a.total - b.total;
    return 0;
  });

  return list;
}

// ---------- RENDER: TRIPS ----------
function renderTrips() {
  const visible = getVisibleTrips();
  tripCount.textContent = `${history.length} trip${history.length === 1 ? "" : "s"}`;

  if (history.length === 0) {
    emptyState.classList.remove("hidden");
    noResults.classList.add("hidden");
    tripList.innerHTML = "";
    return;
  }
  emptyState.classList.add("hidden");

  if (visible.length === 0) {
    noResults.classList.remove("hidden");
    tripList.innerHTML = "";
    return;
  }
  noResults.classList.add("hidden");

  tripList.innerHTML = visible
    .map(
      (trip) => `
      <details class="trip">
        <summary>
          <span class="trip-date">${formatDate(trip.date)}</span>
          <span class="trip-meta">${trip.items.length} item${trip.items.length === 1 ? "" : "s"}</span>
          <span class="trip-total">${money(trip.total)}</span>
        </summary>
        <ul class="trip-items">
          ${trip.items
            .map(
              (i) => `
            <li>
              <span>
                <span>${escapeHtml(i.name)}</span><br>
                <span class="trip-item-meta">${CATEGORY_LABEL[i.category] || i.category} · qty ${i.quantity} × ${money(i.price)}</span>
              </span>
              <span class="trip-item-sub">${money(i.price * i.quantity)}</span>
            </li>`
            )
            .join("")}
        </ul>
      </details>`
    )
    .join("");
}

// ---------- RENDER: ALL ----------
function render() {
  renderStats();
  renderTrips();
}

// ---------- INIT ----------
render();
