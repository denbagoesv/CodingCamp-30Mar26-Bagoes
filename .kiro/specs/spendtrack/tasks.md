# Tasks — SpendTrack

## Task List

---

### Task 1: Project Setup
**Status:** ✅ Done

- Create folder structure: `css/`, `js/`
- Create `index.html` with base HTML5 boilerplate
- Link Google Fonts (Space Grotesk, Inter)
- Load Chart.js via CDN
- Link `css/style.css` and `js/app.js`

---

### Task 2: HTML Structure & Semantic Markup
**Status:** ✅ Done

- Build semantic layout using `<header>`, `<main>`, `<section>`, `<form>`
- Add balance card section with total amount and category stats
- Add expense input form with `<label for>` linked to inputs
- Add spending limit section
- Add chart section with `<canvas>`
- Add transaction list section with sort dropdown
- Add toast notification element with `aria-live`
- Add dark/light toggle button in header

---

### Task 3: CSS Styling & Theming
**Status:** ✅ Done

- Define CSS custom properties for dark and light themes on `[data-theme]`
- Style header with gradient background and glow effect
- Style balance card with gradient and over-limit pulse animation
- Style form inputs with focus states
- Style stat chips, chart legend, transaction items
- Style empty state, toast notifications
- Add `@keyframes slideIn` for transaction item entrance animation

---

### Task 4: Responsive Layout
**Status:** ✅ Done

- Default single-column layout for mobile
- 2-column CSS Grid layout at `min-width: 768px`
- Left column: form, spending limit, chart
- Right column: transaction list with dynamic scroll height
- Mobile breakpoint (`max-width: 480px`) adjustments:
  - Reduced padding on header and balance card
  - Stats chips use 3-column grid
  - Amount + Category inputs stack vertically
  - Spending limit button goes full width

---

### Task 5: Core JavaScript — State & Helpers
**Status:** ✅ Done

- Initialize `transactions` array from localStorage
- Implement `fmt()` for short number formatting (K, M)
- Implement `fmtFull()` for full locale number formatting
- Implement `save()` to persist to localStorage
- Implement `escHtml()` for XSS protection
- Implement `showToast()` for success/error notifications

---

### Task 6: Add & Delete Transactions
**Status:** ✅ Done

- Implement `handleSubmit(event)` with form validation
- Validate item name is not empty
- Validate amount is a positive number
- Push new transaction to array, save, and re-render
- Reset form after successful submission
- Implement `deleteTransaction(id)` to filter and re-render

---

### Task 7: Render Functions
**Status:** ✅ Done

- Implement `render()` to update total, meta, and category stats
- Implement `renderChart(totals)` using Chart.js doughnut
- Chart shows neutral gray when no data exists
- Chart center label shows top spending category
- Implement `renderList()` to render transaction items as HTML
- Render empty state when transaction list is empty

---

### Task 8: Dark / Light Mode Toggle (Optional Challenge)
**Status:** ✅ Done

- Implement `initTheme()` to load saved theme from localStorage on page load
- Implement `toggleTheme()` to switch `data-theme` attribute on `<html>`
- Persist theme preference to localStorage
- Update toggle button emoji (🌙 / ☀️)
- Re-render chart on theme toggle to update tooltip colors

---

### Task 9: Spending Limit & Highlight (Optional Challenge)
**Status:** ✅ Done

- Implement `setLimit()` to save limit to localStorage
- Implement `renderLimitStatus(total)` to show progress vs limit
- Pre-fill limit input with saved value on load
- Toggle `.over-limit` class on balance card when total ≥ limit
- Balance card turns red with pulse animation when over limit

---

### Task 10: Sort Transactions (Optional Challenge)
**Status:** ✅ Done

- Add sort dropdown with options: Latest, Amount ↓, Amount ↑, Category
- Implement `getSorted()` to return sorted copy of transactions array
- Sort by date (default, newest first), amount descending, amount ascending, or category alphabetically
- `renderList()` uses `getSorted()` instead of raw array
