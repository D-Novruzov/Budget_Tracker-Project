# Budget Tracker

This is a simple yet functional budget tracking web application that allows users to record incomes and expenses, visualize their finances, and switch between currencies. It was one of my first larger JavaScript projects and gave me hands-on experience with DOM manipulation, modular design, localStorage, APIs, and data visualization.

## Features

- User-based income and expense tracking
- Currency conversion using external API
- Real-time updates of balance, income, and expenses
- Interactive transaction history with filters
- Financial overview using a chart (Chart.js)
- Local storage-based user state and persistence

## Technologies Used

- **JavaScript (ES6+)** – Core logic and DOM interaction
- **HTML/CSS** – Basic UI structure and styling
- **Chart.js** – For rendering income/expense visualization
- **LocalStorage API** – Storing user and transaction data
- **Fetch API** – To retrieve currency conversion rates
- **Modular JS** – Code is split across helper modules for organization and reuse

## Structure

- `state.js` – Global application state
- `helpers.js` – Utility functions for data handling and DOM updates
- `financeChart.js` – Chart rendering logic
- `config.js` – Currency symbols and config constants
- `index.html` – Main UI
- `style.css` – Styling
- `login.html`, `signup.html` – Basic login flow (not secure or production-ready)


## Limitations

- No server or database integration — all data is stored in the browser
- No authentication security — user login is stored client-side
- Basic UI/UX, mainly focused on functionality

To run the app locally:

1. Clone the repo
2. Open `index.html` in your browser. Make sure to register a user on `signup.html` first.

> Note: This app is fully frontend-based. No server is required.

