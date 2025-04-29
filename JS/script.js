import { state } from "./state";
import { storageManager } from "./helpers";
import { fetchAPI } from "./helpers";
import { clearStorage, contentChanger } from "./helpers";
import { parser } from "./helpers";
import { currencies } from "./config";
import { chartMaker } from "./financeChart";

const transactionDesc = document.getElementById("text");
const transactionAmount = document.getElementById("amount");
const transactionForm = document.getElementById("transaction-form");
const submitBtn = document.getElementById("submit-btn");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const balanceBox = document.querySelector(".balance-box");
const balance = document.getElementById("balance");
const currencyBox = document.getElementById("currency-select");
const addBalanceBtn = document.querySelector(".add-balance-btn");
const addBalanceForm = document.querySelector(".add-balance-form");
const balanceSubmitBtn = document.getElementById("submit-balance");
const balanceValue = document.getElementById("balance-input");
const historyToggle = document.getElementById("history-toggle");
const filtercheckBtns = document.querySelectorAll('input[name="filter"]');
export const transactionList = document.querySelector("#transaction-list");
export const financeChart = document.getElementById("finances");

// Load users and active user
let users = storageManager("get", "users");
export let activeUser = users.find((user) => user.userActive === true);
if (!activeUser) {
  // No active user, redirect to login page
  window.location.href = "./login.html";
}

// Utility function to save the updated activeUser back to users array
const saveActiveUser = function () {
  console.log("function was called");

  // Retrieve the users array from local storage and parse it
  let users = JSON.parse(window.localStorage.getItem("users"));
  if (!users) {
    console.log("No users found in localStorage");
    return;
  }

  console.log("users array was retrieved");

  // Update the activeUser in the users array
  users = users.map((u) =>
    u.username === activeUser.username ? activeUser : u
  );

  console.log("updated users array");

  // Save the updated users array back to localStorage
  window.localStorage.setItem("users", JSON.stringify(users));
};

let curBalance =
  activeUser && activeUser.history ? activeUser.history.currentBal : 0;

const historyElementCreator = async function (arr, insertEl) {
  insertEl.innerHTML = "";
  let data, desc, price;

  for (const el of arr) {
    if (Object.hasOwn(el, "description")) {
      data = "expense";
      desc = el.description;
      price = -Number(el.amount);
    } else {
      data = "deposit";
      desc = "";
      price = Number(el.amount);
    }
    const date = new Date(el.date);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    const html = `<li class="transaction-item">
      <span class="transaction-emoji">💸</span>
      <div class="transaction-details">
        <p class="transaction-type">${data}</p>
        <p class="transaction-desc">${desc}</p>
        <p class="transaction-date">${month}/${day}/${year}</p>
      </div>
      <span class="transaction-amount" style="color: ${
        data === "deposit" ? "green" : "red"
      };">
        ${currencies[state.selectedCurrency]}${price.toFixed(2)}
      </span>
    </li>`;

    insertEl.insertAdjacentHTML("afterbegin", html);
  }
};

let rate = 1;

// Hiding balance form
addBalanceBtn.addEventListener("click", function () {
  addBalanceForm.classList.toggle("hidden");
});

// What happens when DOM is loaded
document.addEventListener("DOMContentLoaded", async function () {
  balance.textContent = `$${curBalance.toFixed(2)}`;
  const totalIncome = activeUser.history.totalIncome;
  income.textContent = `$${totalIncome.toFixed(2)}`;
  const totalExpense = activeUser.history.totalExpenses;
  expense.textContent = `$${totalExpense.toFixed(2)}`;
  chartMaker();
});

// Adding balance (income)
addBalanceForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const date = new Date();
  const deposit = { amount: parseFloat(balanceValue.value), date: date };

  if (isNaN(deposit.amount) || deposit.amount <= 0) {
    alert("Please enter a valid number");
    return;
  }

  // Update activeUser's balance and history
  activeUser.history.currentBal += deposit.amount;
  activeUser.history.totalIncome += deposit.amount;
  activeUser.history.transactionHistory.push(deposit);

  // Update the UI
  balance.textContent = contentChanger(activeUser.history.currentBal);
  income.textContent = contentChanger(activeUser.history.totalIncome);

  // Save the updated activeUser to localStorage
  saveActiveUser();

  // Reset the form
  addBalanceForm.classList.toggle("hidden");
  balanceValue.value = "";
});

// Adding transaction (expenses)
transactionForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const description = transactionDesc.value;
  const amount = parseFloat(transactionAmount.value);

  if (!description || isNaN(amount) || amount <= 0) {
    alert("Please fill out all fields correctly.");
    return;
  }

  const date = new Date();
  const expenseData = { description: description, amount: amount, date: date };

  // Update activeUser's balance and history for expenses
  activeUser.history.currentBal -= amount;
  activeUser.history.totalExpenses += amount;
  activeUser.history.transactionHistory.push(expenseData);

  // Update the UI for expenses
  balance.textContent = contentChanger(activeUser.history.currentBal);
  expense.textContent = contentChanger(activeUser.history.totalExpenses);

  // Save the updated activeUser to localStorage
  saveActiveUser();

  // Clear form fields
  transactionAmount.value = "";
  transactionDesc.value = "";
});

// Handling currency change
currencyBox.addEventListener("change", async function () {
  try {
    state.selectedCurrency = currencyBox.value;
    const rateData = await fetchAPI("USD", state.selectedCurrency, 1);
    rate = rateData.result;

    if (!rate || isNaN(rate)) throw new Error("Invalid rate received");

    // Update income, expenses, and balance using the new rate
    const totalIncome = activeUser.history.totalIncome;
    const totalExpense = activeUser.history.totalExpenses;
    const currentBalance = activeUser.history.currentBal;

    income.textContent = `${currencies[state.selectedCurrency]}${(
      totalIncome * rate
    ).toFixed(2)}`;
    expense.textContent = `${currencies[state.selectedCurrency]}${(
      totalExpense * rate
    ).toFixed(2)}`;
    balance.textContent = `${currencies[state.selectedCurrency]}${(
      currentBalance * rate
    ).toFixed(2)}`;

    // Save the updated activeUser to localStorage
    saveActiveUser();
  } catch (err) {
    alert("Something went wrong while fetching exchange rates.");
    console.error(err);
  }
});

// Toggling transaction history
historyToggle.addEventListener("click", function () {
  transactionList.classList.toggle("hidden");
  historyElementCreator(activeUser.history.transactionHistory, transactionList);
});

// Filtering transactions
filtercheckBtns.forEach((btn) => {
  btn.addEventListener("change", () => {
    const value = btn.value;
    const today = new Date();
    let filtered = [];

    if (value === "all") {
      filtered = activeUser.history.transactionHistory;
    } else {
      let fromDate = new Date();
      if (value === "lastWeek") {
        fromDate.setDate(today.getDate() - 7);
      } else if (value === "lastMonth") {
        fromDate.setMonth(today.getMonth() - 1);
      }

      filtered = activeUser.history.transactionHistory.filter((tx) => {
        const txDate = new Date(tx.date);
        return txDate >= fromDate && txDate <= today;
      });
    }

    historyElementCreator(filtered, transactionList);
  });
});
