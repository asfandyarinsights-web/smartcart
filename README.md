# 🛒 SmartCart

A simple shopping list app to manage items, track spending, and stay on budget.

🔗 **Live demo:** https://asfandyarinsights-web.github.io/smartcart/

## Features

- **Budget tracking:** set a budget and see how much you have spent against it
- **Add items** with a name, quantity, price, and category
- **Categories:** 🥕 Grocery, 🏠 Home, 🥼 Clothing, 💊 Health, ⚡ Electronics
- **Search, filter, and sort** by name, price, or category
- **Mark items as bought** and clear all bought items in one click
- **Undo** for accidental changes
- **Live summary:** total items, bought, pending, most expensive, cheapest, amount spent so far, and full list value
- **Three pages:** Home (shopping list), History, and Settings
- **Saved in your browser:** your data stays after you close the page, using localStorage

## Screenshots

![SmartCart home page](screenshot.png)

## Tech Stack

- HTML
- CSS
- JavaScript
- localStorage for saving data
- GitHub Pages for hosting

## Run Locally

1. Clone the repository:
```
   git clone https://github.com/asfandyarinsights-web/smartcart.git
```
2. Open the `smartcart` folder.
3. Open `index.html` in your browser.

No installation or build step is needed.

## What I Learned

- Saving data in the browser with localStorage, and sharing one storage key across several pages (Home, History, Settings)
- Keeping the interface in sync with the data: live totals, filters, sorting, and budget tracking
- Building an undo feature for accidental changes
- Designing a consistent look across a multi-page app
- Deploying a static site with GitHub Pages

## Future Improvements

- Export the shopping list as PDF or CSV
- Support more currencies
- Add spending charts on the History page
- Add user accounts so lists sync across devices
- Add a "Recurring items" option for weekly groceries

## Author

**Asfandyar** – IT student and web developer
GitHub: [asfandyarinsights-web](https://github.com/asfandyarinsights-web)
