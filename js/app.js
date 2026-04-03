// ── State ────────────────────────────────────────────────────────────────────
let transactions = JSON.parse(localStorage.getItem('txns') || '[]');
let spendLimit   = parseFloat(localStorage.getItem('spendLimit')) || 0;
let chart;

const ICONS = { food: '🍜', transport: '🚗', fun: '🎮' };

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n) {
  if (n >= 1_000_000) return 'Rp ' + (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return 'Rp ' + (n / 1_000).toFixed(0) + 'K';
  return 'Rp ' + n.toLocaleString('id-ID');
}

function fmtFull(n) {
  return 'Rp ' + Number(n).toLocaleString('id-ID');
}

function save() {
  localStorage.setItem('txns', JSON.stringify(transactions));
}

function escHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showToast(msg, isError = false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast' + (isError ? ' error' : '');
  void t.offsetWidth;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

// ── Dark / Light Mode ─────────────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  document.getElementById('themeToggle').textContent = saved === 'dark' ? '🌙' : '☀️';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  document.getElementById('themeToggle').textContent = next === 'dark' ? '🌙' : '☀️';
  renderChart({ // re-render chart so tooltip colors update
    food:      transactions.filter(t => t.category === 'food').reduce((s, t) => s + t.amount, 0),
    transport: transactions.filter(t => t.category === 'transport').reduce((s, t) => s + t.amount, 0),
    fun:       transactions.filter(t => t.category === 'fun').reduce((s, t) => s + t.amount, 0),
  });
}

document.getElementById('themeToggle').addEventListener('click', toggleTheme);

// ── Spend Limit ───────────────────────────────────────────────────────────────
function setLimit() {
  const val = parseFloat(document.getElementById('limitInput').value);
  if (!val || val <= 0) { showToast('Enter a valid limit 💰', true); return; }
  spendLimit = val;
  localStorage.setItem('spendLimit', val);
  showToast('Limit set to ' + fmtFull(val) + ' ✅');
  render();
}

function renderLimitStatus(total) {
  const el = document.getElementById('limitStatus');
  const input = document.getElementById('limitInput');

  if (!spendLimit) { el.textContent = ''; el.className = 'limit-status'; return; }

  // Pre-fill input with saved limit
  if (!input.value) input.value = spendLimit;

  const pct  = Math.min((total / spendLimit) * 100, 100).toFixed(0);
  const over = total >= spendLimit;

  el.className = 'limit-status ' + (over ? 'over' : 'safe');
  el.innerHTML = over
    ? `⚠️ Over limit! Spent <strong>${fmtFull(total)}</strong> of <strong>${fmtFull(spendLimit)}</strong>`
    : `✅ <strong>${fmtFull(total)}</strong> of <strong>${fmtFull(spendLimit)}</strong> (${pct}%)`;

  // Highlight balance card when over limit
  document.getElementById('balanceCard').classList.toggle('over-limit', over);
}

// ── Add Transaction ───────────────────────────────────────────────────────────
function handleSubmit(event) {
  event.preventDefault();

  const name     = document.getElementById('itemName').value.trim();
  const amount   = parseFloat(document.getElementById('itemAmount').value);
  const category = document.getElementById('itemCategory').value;

  if (!name)                  { showToast('Please enter an item name ✏️', true); return; }
  if (!amount || amount <= 0) { showToast('Please enter a valid amount 💰', true); return; }

  transactions.unshift({ id: Date.now(), name, amount, category });
  save();
  render();

  document.getElementById('txnForm').reset();
  showToast('Transaction added! ✅');
}

// ── Delete Transaction ────────────────────────────────────────────────────────
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  save();
  render();
  showToast('Deleted 🗑️');
}

// ── Sort ──────────────────────────────────────────────────────────────────────
function getSorted() {
  const mode = document.getElementById('sortSelect').value;
  const list = [...transactions];
  if (mode === 'amount-desc') return list.sort((a, b) => b.amount - a.amount);
  if (mode === 'amount-asc')  return list.sort((a, b) => a.amount - b.amount);
  if (mode === 'category')    return list.sort((a, b) => a.category.localeCompare(b.category));
  return list; // default: date (already newest-first)
}

// ── Render ────────────────────────────────────────────────────────────────────
function render() {
  const total  = transactions.reduce((s, t) => s + t.amount, 0);
  const totals = { food: 0, transport: 0, fun: 0 };
  transactions.forEach(t => totals[t.category] += t.amount);

  document.getElementById('totalAmount').textContent = fmtFull(total);
  document.getElementById('totalMeta').textContent =
    transactions.length + ' transaction' + (transactions.length !== 1 ? 's' : '');

  document.getElementById('statFood').textContent      = fmt(totals.food);
  document.getElementById('statTransport').textContent = fmt(totals.transport);
  document.getElementById('statFun').textContent       = fmt(totals.fun);

  renderLimitStatus(total);
  renderChart(totals);
  renderList();
}

// ── Render Chart ──────────────────────────────────────────────────────────────
function renderChart(totals) {
  const data   = [totals.food, totals.transport, totals.fun];
  const total  = data.reduce((a, b) => a + b, 0);
  const labels = ['Food', 'Transport', 'Fun'];
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

  let topLabel = '—';
  if (total > 0) topLabel = labels[data.indexOf(Math.max(...data))];
  document.getElementById('chartCenterVal').textContent = topLabel;

  const ctx = document.getElementById('pieChart').getContext('2d');
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: total > 0 ? data : [1, 1, 1],
        backgroundColor: total > 0
          ? ['#00d68f', '#4cc9f0', '#ffd166']
          : [isDark ? '#2a2a38' : '#e0e0e8', isDark ? '#2a2a38' : '#e0e0e8', isDark ? '#2a2a38' : '#e0e0e8'],
        borderWidth: 0,
        hoverOffset: 6,
      }]
    },
    options: {
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: total > 0,
          callbacks: { label: (ctx) => ' ' + fmtFull(ctx.raw) },
          backgroundColor: isDark ? '#1e1e28' : '#ffffff',
          borderColor: isDark ? '#2a2a38' : '#e0e0e8',
          borderWidth: 1,
          titleColor: isDark ? '#f0f0f8' : '#0e0e12',
          bodyColor: isDark ? '#a0a0c0' : '#555570',
          padding: 10,
        }
      },
      animation: { animateRotate: true, duration: 500 }
    }
  });
}

// ── Render List ───────────────────────────────────────────────────────────────
function renderList() {
  const list  = document.getElementById('txnList');
  const count = document.getElementById('txnCount');
  count.textContent = transactions.length + ' item' + (transactions.length !== 1 ? 's' : '');

  if (transactions.length === 0) {
    list.innerHTML = `
      <li>
        <div class="empty-state">
          <div class="emoji">🧾</div>
          <p>No transactions yet.<br>Add one above to get started!</p>
        </div>
      </li>`;
    return;
  }

  list.innerHTML = getSorted().map(t => `
    <li class="txn-item">
      <div class="txn-icon ${t.category}">${ICONS[t.category]}</div>
      <div class="txn-info">
        <div class="txn-name">${escHtml(t.name)}</div>
        <div class="txn-cat">${t.category}</div>
      </div>
      <div class="txn-amount ${t.category}">${fmtFull(t.amount)}</div>
      <button class="btn-del" onclick="deleteTransaction(${t.id})" title="Delete">✕</button>
    </li>
  `).join('');
}

// ── Init ──────────────────────────────────────────────────────────────────────
initTheme();
render();
