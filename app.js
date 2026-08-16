// ---------- CONSTANTS ----------
const ITEMS_KEY = "smartcart:items";
const BUDGET_KEY = "smartcart:budget";
const HISTORY_KEY = "smartcart:history";

const CATEGORY_LABEL = {
  grocery: "🥕 Grocery",
  home: "🏠 Home",
  clothing: "🥼 Clothing",
  health: "💊 Health",
  electronics: "⚡ Electronics",
};

// ---------- STATE ----------
let items = loadJSON(ITEMS_KEY, []);
let budget = loadJSON(BUDGET_KEY, null);
let selectedCategory = null; // for the add-item form
let activeFilter = "all"; // for the list view
let currentSort = "none";

// ---------- ELEMENTS ----------
const el = (id) => document.getElementById(id);

const budgetFigure = el("budgetFigure");
const editBudgetBtn = el("editBudgetBtn");
const budgetForm = el("budgetForm");
const budgetInput = el("budgetInput");
const budgetFill = el("budgetFill");
const spentLabel = el("spentLabel");
const budgetNote = el("budgetNote");

const itemForm = el("itemForm");
const itemName = el("itemName");
const itemQty = el("itemQty");
const itemPrice = el("itemPrice");
const categoryChips = el("categoryChips");
const formError = el("formError");

const searchInput = el("searchInput");
const sortSelect = el("sortSelect");
const filterChips = el("filterChips");

const listCount = el("listCount");
const itemList = el("itemList");
const emptyState = el("emptyState");
const noResults = el("noResults");
const clearBoughtBtn = el("clearBoughtBtn");

const statTotal = el("statTotal");
const statBought = el("statBought");
const statPending = el("statPending");
const statMostExpensive = el("statMostExpensive");
const statCheapest = el("statCheapest");
const statSpent = el("statSpent");
const statEstimate = el("statEstimate");

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

// ---------- BUDGET ----------
editBudgetBtn.addEventListener("click", () => {
  budgetInput.value = budget ?? "";
  budgetForm.classList.remove("hidden");
  budgetInput.focus();
});
budgetForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = parseFloat(budgetInput.value);
  budget = isNaN(value) || value <= 0 ? null : value;
  saveJSON(BUDGET_KEY, budget);
  budgetForm.classList.add("hidden");
  render();
});

// ---------- ADD ITEM: CATEGORY CHIPS ----------
categoryChips.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  selectedCategory = chip.dataset.cat;
  categoryChips.querySelectorAll(".chip").forEach((c) => c.classList.toggle("is-active", c === chip));
});

// ---------- ADD ITEM ----------
itemForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = itemName.value.trim();
  const qty = parseFloat(itemQty.value);
  const price = parseFloat(itemPrice.value);

  const valid = name && qty > 0 && price >= 0 && selectedCategory;
  formError.classList.toggle("hidden", !!valid);
  if (!valid) return;

  items.unshift({
    id: Date.now(),
    name,
    quantity: qty,
    price,
    category: selectedCategory,
    status: "pending",
  });
  saveJSON(ITEMS_KEY, items);

  itemForm.reset();
  selectedCategory = null;
  categoryChips.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));

  showToast(`${name} added to your list`);
  render();
});

// ---------- FILTER CHIPS ----------
filterChips.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  activeFilter = chip.dataset.filter;
  filterChips.querySelectorAll(".chip").forEach((c) => c.classList.toggle("is-active", c === chip));
  renderList();
});

// ---------- SEARCH / SORT ----------
searchInput.addEventListener("input", renderList);
sortSelect.addEventListener("change", () => {
  currentSort = sortSelect.value;
  renderList();
});

// ---------- ITEM LIST ACTIONS (toggle bought / delete) ----------
itemList.addEventListener("click", (e) => {
  const checkBtn = e.target.closest(".item-check");
  const delBtn = e.target.closest(".item-delete");

  if (checkBtn) {
    const id = Number(checkBtn.dataset.id);
    const item = items.find((i) => i.id === id);
    if (!item) return;
    item.status = item.status === "bought" ? "pending" : "bought";
    saveJSON(ITEMS_KEY, items);
    render();
    return;
  }

  if (delBtn) {
    const id = Number(delBtn.dataset.id);
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return;
    const [removed] = items.splice(index, 1);
    saveJSON(ITEMS_KEY, items);
    render();
    showToast(`${removed.name} removed`, () => {
      items.splice(index, 0, removed);
      saveJSON(ITEMS_KEY, items);
      render();
    });
  }
});

// ---------- CLEAR BOUGHT (archives the trip into history instead of deleting it) ----------
clearBoughtBtn.addEventListener("click", () => {
  const boughtItems = items.filter((i) => i.status === "bought");
  if (boughtItems.length === 0) {
    showToast("No bought items to clear");
    return;
  }

  const history = loadJSON(HISTORY_KEY, []);
  const trip = {
    id: Date.now(),
    date: new Date().toISOString(),
    items: boughtItems.map((i) => ({ ...i })),
    total: boughtItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
  };
  history.unshift(trip);
  saveJSON(HISTORY_KEY, history);

  items = items.filter((i) => i.status !== "bought");
  saveJSON(ITEMS_KEY, items);
  render();

  showToast(`${boughtItems.length} item(s) logged to history`, () => {
    // Undo: pull the trip back out of history and restore the items.
    const undoHistory = loadJSON(HISTORY_KEY, []).filter((t) => t.id !== trip.id);
    saveJSON(HISTORY_KEY, undoHistory);
    items = [...items, ...boughtItems];
    saveJSON(ITEMS_KEY, items);
    render();
  });
});

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

// ---------- DERIVED STATS (single source of truth) ----------
function computeStats() {
  const bought = items.filter((i) => i.status === "bought");
  const spent = bought.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const estimate = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  let mostExpensive = null;
  let cheapest = null;
  items.forEach((i) => {
    if (!mostExpensive || i.price > mostExpensive.price) mostExpensive = i;
    if (!cheapest || i.price < cheapest.price) cheapest = i;
  });

  return {
    total: items.length,
    bought: bought.length,
    pending: items.length - bought.length,
    spent,
    estimate,
    mostExpensive,
    cheapest,
  };
}

// ---------- RENDER: BUDGET ----------
function renderBudget(stats) {
  if (budget === null) {
    budgetFigure.textContent = "Not set";
    budgetFill.style.width = "0%";
    budgetFill.className = "budget-fill";
    spentLabel.textContent = `${money(stats.spent)} spent`;
    budgetNote.textContent = "Set a budget to track it";
    return;
  }

  budgetFigure.textContent = money(budget);
  const pct = Math.min((stats.spent / budget) * 100, 100);
  budgetFill.style.width = `${pct}%`;
  budgetFill.className = "budget-fill" + (stats.spent > budget ? " is-over" : pct >= 80 ? " is-warn" : "");

  spentLabel.textContent = `${money(stats.spent)} spent`;
  if (stats.spent > budget) {
    budgetNote.textContent = `${money(stats.spent - budget)} over budget`;
  } else {
    budgetNote.textContent = `${money(budget - stats.spent)} left`;
  }

  // Extra heads-up if the *whole list*, not just what's bought, would blow the budget.
  if (stats.estimate > budget && stats.spent <= budget) {
    budgetNote.textContent += ` · full list would be ${money(stats.estimate - budget)} over`;
  }
}

// ---------- RENDER: SUMMARY CARDS ----------
function renderSummary(stats) {
  statTotal.textContent = stats.total;
  statBought.textContent = stats.bought;
  statPending.textContent = stats.pending;
  statSpent.textContent = money(stats.spent);
  statEstimate.textContent = money(stats.estimate);
  statMostExpensive.textContent = stats.mostExpensive
    ? `${stats.mostExpensive.name} (${money(stats.mostExpensive.price)})`
    : "—";
  statCheapest.textContent = stats.cheapest
    ? `${stats.cheapest.name} (${money(stats.cheapest.price)})`
    : "—";
}

// ---------- RENDER: LIST ----------
function getVisibleItems() {
  const query = searchInput.value.trim().toLowerCase();

  let list = items.filter((i) => {
    const matchesQuery = !query || i.name.toLowerCase().includes(query);
    const matchesFilter = activeFilter === "all" || i.category === activeFilter;
    return matchesQuery && matchesFilter;
  });

  list = [...list].sort((a, b) => {
    if (currentSort === "name") return a.name.localeCompare(b.name);
    if (currentSort === "price") return a.price - b.price;
    if (currentSort === "category") return a.category.localeCompare(b.category);
    return 0;
  });

  return list;
}

function renderList() {
  const visible = getVisibleItems();
  listCount.textContent = `${items.length} item${items.length === 1 ? "" : "s"}`;

  if (items.length === 0) {
    emptyState.classList.remove("hidden");
    noResults.classList.add("hidden");
    itemList.hidden = true;
    itemList.innerHTML = "";
    return;
  }
  emptyState.classList.add("hidden");

  if (visible.length === 0) {
    noResults.classList.remove("hidden");
    itemList.hidden = true;
    itemList.innerHTML = "";
    return;
  }
  noResults.classList.add("hidden");
  itemList.hidden = false;

  itemList.innerHTML = visible
    .map((i) => {
      const subtotal = i.price * i.quantity;
      return `
      <li class="item-row is-${i.status}">
        <button class="item-check" data-id="${i.id}" aria-label="Mark ${escapeHtml(i.name)} as ${i.status === "bought" ? "pending" : "bought"}">
          ${i.status === "bought" ? "✓" : ""}
        </button>
        <div class="item-main">
          <p class="item-name">${escapeHtml(i.name)}</p>
          <p class="item-meta">${CATEGORY_LABEL[i.category] || i.category} · qty ${i.quantity} × ${money(i.price)}</p>
        </div>
        <span class="item-subtotal">${money(subtotal)}</span>
        <button class="item-delete" data-id="${i.id}" aria-label="Remove ${escapeHtml(i.name)}">✕</button>
      </li>`;
    })
    .join("");
}

// ---------- RENDER: ALL ----------
function render() {
  const stats = computeStats();
  renderBudget(stats);
  renderSummary(stats);
  renderList();
}

// ---------- INIT ----------
render();
