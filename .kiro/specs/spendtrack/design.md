# Design — SpendTrack

## Architecture

Single-page application with no build step. All logic lives in one JS file, one CSS file, and one HTML file.

```
index.html        — structure & markup
css/style.css     — all styles including theming and responsive
js/app.js         — all application logic
```

---

## UI Layout

### Desktop (≥768px)
```
┌─────────────────────────────────────────────────┐
│  Header: SpendTrack logo          [🌙 toggle]   │
├─────────────────────────────────────────────────┤
│  Balance Card: Total Spent   [Food][Transport][Fun] │
├───────────────────────┬─────────────────────────┤
│  LEFT COLUMN          │  RIGHT COLUMN           │
│  ┌─────────────────┐  │  Transactions header    │
│  │  Add Expense    │  │  ┌─────────────────┐   │
│  │  form           │  │  │ txn item        │   │
│  └─────────────────┘  │  │ txn item        │   │
│  ┌─────────────────┐  │  │ txn item        │   │
│  │  Spending Limit │  │  │ ...scrollable   │   │
│  └─────────────────┘  │  └─────────────────┘   │
│  ┌─────────────────┐  │                         │
│  │  Doughnut Chart │  │                         │
│  └─────────────────┘  │                         │
└───────────────────────┴─────────────────────────┘
```

### Mobile (<768px)
Single column, all sections stacked vertically. Balance card stats stack below total. Amount and Category inputs stack vertically. Spending limit button goes full width.

---

## Component Breakdown

### Header
- App name + subtitle
- Dark/light mode toggle button (top right)
- Fixed dark gradient background regardless of theme

### Balance Card
- Full-width gradient banner (purple → cyan, or red when over limit)
- Left: total amount + transaction count
- Right: category stat chips (Food / Transport / Fun)

### Add Expense Form
- Text input: Item Name
- Number input: Amount
- Select: Category (Food, Transport, Fun)
- Submit button triggers `handleSubmit(event)`

### Spending Limit Section
- Number input for limit value
- "Set" button triggers `setLimit()`
- Status line shows progress or over-limit warning

### Spending Chart
- Chart.js doughnut, 68% cutout
- Center label shows top category name
- Legend below chart
- Neutral gray when no data

### Transaction List
- Sort dropdown (Latest / Amount ↓ / Amount ↑ / Category)
- Item count badge
- Scrollable `<ul>` with max-height
- Each item: icon, name, category, amount, delete button
- Empty state with illustration when list is empty

### Toast Notification
- Fixed bottom-center
- Slides up on show, slides down on hide
- Green for success, red for error
- Uses `aria-live="polite"` for accessibility

---

## Data Model

### Transaction object
```js
{
  id: Number,       // Date.now() timestamp, used as unique key
  name: String,     // item name, max 60 chars
  amount: Number,   // positive float
  category: String  // 'food' | 'transport' | 'fun'
}
```

### localStorage keys
| Key         | Type   | Description                    |
|-------------|--------|--------------------------------|
| `txns`      | JSON   | Array of transaction objects   |
| `spendLimit`| String | Numeric limit value            |
| `theme`     | String | `'dark'` or `'light'`          |

---

## Theming

CSS custom properties on `[data-theme]` attribute of `<html>`:

| Variable     | Dark          | Light         |
|--------------|---------------|---------------|
| `--bg`       | `#0e0e12`     | `#f4f4fb`     |
| `--surface`  | `#17171f`     | `#ffffff`     |
| `--surface2` | `#1e1e28`     | `#ebebf5`     |
| `--border`   | `#2a2a38`     | `#d8d8e8`     |
| `--text`     | `#f0f0f8`     | `#0e0e1a`     |
| `--muted`    | `#6e6e88`     | `#8888aa`     |
| `--accent`   | `#7b61ff`     | `#7b61ff`     |

---

## Typography

| Usage         | Font           | Weight  |
|---------------|----------------|---------|
| Headings, numbers, buttons | Space Grotesk | 500–700 |
| Body, inputs, labels       | Inter         | 300–500 |

---

## Color Palette

| Name      | Hex       | Usage                        |
|-----------|-----------|------------------------------|
| Accent    | `#7b61ff` | Buttons, focus rings         |
| Green     | `#00d68f` | Food category, success toast |
| Blue      | `#4cc9f0` | Transport category           |
| Yellow    | `#ffd166` | Fun category                 |
| Red       | `#ff6b6b` | Error, over-limit state      |
