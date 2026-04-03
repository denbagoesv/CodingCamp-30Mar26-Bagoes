# Requirements — SpendTrack

## Overview
SpendTrack is a client-side expense and budget visualizer. Users can track daily spending by category, visualize distribution via a chart, and set a spending limit alert — all without any backend or account required.

---

## Functional Requirements

### FR-1: Input Form
- User can input an expense with three fields: Item Name, Amount (Rp), and Category
- Categories available: Food, Transport, Fun
- Form validates that all fields are filled before submission
- Amount must be a positive number
- On successful submit, form resets and a success toast appears
- Pressing Enter in any field submits the form

### FR-2: Transaction List
- All added transactions are displayed in a scrollable list
- Each item shows: category icon, item name, category label, and amount
- Transactions can be deleted individually
- List shows an empty state when no transactions exist
- Transaction count is displayed above the list

### FR-3: Total Balance
- Total spent amount is displayed prominently at the top
- Updates automatically whenever a transaction is added or deleted
- Shows transaction count below the total

### FR-4: Category Stats
- Spending totals per category (Food, Transport, Fun) are shown as chips
- Values update automatically on every change

### FR-5: Visual Chart
- A doughnut chart visualizes spending distribution by category
- Chart uses Chart.js loaded via CDN
- Chart updates automatically when transactions change
- When no data exists, chart renders in a neutral placeholder state
- Center of chart shows the top spending category label

---

## Optional Challenge Requirements (3 of 5 implemented)

### OC-1: Sort Transactions
- User can sort the transaction list by: Latest (date), Amount descending, Amount ascending, or Category
- Sort is applied instantly via a dropdown selector

### OC-2: Highlight Spending Over Limit
- User can set a spending limit (Rp value)
- Limit is persisted in localStorage
- When total spending reaches or exceeds the limit, the balance card turns red with a pulse animation
- A status message shows current spending vs limit with percentage

### OC-3: Dark / Light Mode Toggle
- A toggle button in the header switches between dark and light themes
- Theme preference is persisted in localStorage
- Chart tooltip colors adapt to the active theme

---

## Non-Functional Requirements

### NFR-1: Technology Stack
- HTML for structure (semantic elements)
- CSS for styling (CSS custom properties for theming)
- Vanilla JavaScript only — no frameworks
- No backend server required
- Chart.js via CDN for visualization

### NFR-2: Data Storage
- All data stored client-side via localStorage
- Transactions stored as JSON array under key `txns`
- Spend limit stored under key `spendLimit`
- Theme preference stored under key `theme`

### NFR-3: Browser Compatibility
- Must work in modern browsers: Chrome, Firefox, Edge, Safari
- Can be used as a standalone web app (open index.html directly)

### NFR-4: Performance
- Fast load time — no build step, no bundler
- Responsive UI with smooth CSS transitions
- No noticeable lag when adding or deleting transactions

### NFR-5: Visual Design
- Clean, minimal dark-first interface
- Clear visual hierarchy with section titles
- Readable typography using Space Grotesk (headings) and Inter (body)
- Responsive layout: 2-column on desktop (≥768px), single column on mobile

### NFR-6: Code Quality
- Clean, readable code with section comments
- Input validation before processing
- XSS protection via HTML escaping on all user-generated content
- Semantic HTML elements throughout
