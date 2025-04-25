"use strict";
import { clearStorage, contentChanger } from "./helpers";
import { state } from "./state";
import { storageManager } from "./helpers";
import { fetchAPI } from "./helpers";
import { parser } from "./helpers";
import { currencies } from "./config";
import { API } from "./config";
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
const filtercheckButns = document.querySelectorAll('input[name="filter"]');
export const transactionList = document.querySelector("#transaction-list");
export const financeChart = document.getElementById("finances");
// window.localStorage.setIem("depositHistory", depositHistory);

export const history = {
  transactionHistory: storageManager("get", "transactionHistory") || [],
  totalIncome: storageManager("get", "totalIncome") || [],
  totalExpense: storageManager("get", "totalExpenses"),
};
let curBalance;
if (storageManager("get", "currentBal") === null) {
  curBalance = 0;

  storageManager("set", "currentBal", curBalance);
} else {
  curBalance = parser("currentBal");
}

const historyElementCreator = async function (arr, insertEl) {
  insertEl.innerHTML = "";
  let data;
  let desc;
  let price;

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
            };">${currencies[state.selectedCurrency]}${price.toFixed(2)}</span>
          </li>`;
    insertEl.insertAdjacentHTML("afterbegin", html);
  }
};

let rate = 1;
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//HIDING THE ELEMENT
addBalanceBtn.addEventListener("click", function () {
  addBalanceForm.classList.toggle("hidden");
});
//waht wills how when thE DOM is loaded
document.addEventListener("DOMContentLoaded", async function () {
  balance.textContent = `$${curBalance.toFixed(2)}`;
  const totalIncome = parser("totalIncome");
  income.textContent = `$${totalIncome.toFixed(2)}`;
  const totalExpense = parser("totalExpenses");
  expense.textContent = `$${totalExpense.toFixed(2)}`;
  chartMaker();
});
//adding the total income
addBalanceForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const date = new Date();
  // const formatted = new Intl.DateTimeFormat("en-GB").format(date);
  const deposit = { amount: parseFloat(balanceValue.value), date: date };
  if (isNaN(deposit.amount) || deposit.amount <= 0) {
    alert("please enter the valid number");
    return;
  }
  curBalance += deposit.amount;
  balance.textContent = contentChanger(curBalance);
  storageManager("set", "currentBal", curBalance);
  const storedBalance = parser("totalIncome");

  const updatedBalance = storedBalance + deposit.amount;
  income.textContent = contentChanger(updatedBalance);
  storageManager("set", "totalIncome", updatedBalance);

  history.transactionHistory.push(deposit);
  storageManager("set", "transactionHistory", history.transactionHistory);
  addBalanceForm.classList.toggle("hidden");
  balanceValue.value = "";
});
//adding the transaction (expenses)
transactionForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const description = transactionDesc.value;
  const amount = parseFloat(transactionAmount.value);
  if (amount <= 0) {
    alert("please enter the valid number");
    return;
  }
  if (!description || isNaN(amount)) {
    alert("Please fill out all fields correctly.");
    return;
  }
  const date = new Date();

  const expenseData = {
    description: description,
    amount: amount,
    date: date,
  };
  history.transactionHistory.push(expenseData);
  storageManager("set", "transactionHistory", history.transactionHistory);
  //getting the total expenses
  let totalExpenses = parser("totalExpenses");
  totalExpenses += amount;
  storageManager("set", "totalExpenses", totalExpenses);
  expense.textContent = contentChanger(totalExpenses);
  ///updating the current balance
  let updatedCurrentBalance = parser("currentBal");
  updatedCurrentBalance -= amount;
  balance.textContent = contentChanger(updatedCurrentBalance);
  storageManager("set", "currentBal", updatedCurrentBalance);
  //emptying the values
  transactionAmount.value = "";
  transactionDesc.value = "";
});
//handling the currency changing
currencyBox.addEventListener("change", async function () {
  try {
    state.selectedCurrency = currencyBox.value;

    const rateData = await fetchAPI("USD", state.selectedCurrency, 1);

    rate = rateData.result;

    if (!rate || isNaN(rate)) throw new Error("Invalid rate received");

    const totalIncome = parser("totalIncome");
    const totalExpense = parser("totalExpenses");
    const currentBalance = parser("currentBal");

    // Update the displayed values with proper currency symbols
    income.textContent = `${currencies[state.selectedCurrency]}${(
      totalIncome * rate
    ).toFixed(2)}`;
    expense.textContent = `${currencies[state.selectedCurrency]}${(
      totalExpense * rate
    ).toFixed(2)}`;
    balance.textContent = `${currencies[state.selectedCurrency]}${(
      currentBalance * rate
    ).toFixed(2)}`;

    // Also update curBalance variable to match
    curBalance = currentBalance;
  } catch (err) {
    alert("Something went wrong while fetching exchange rates.");
    console.error(err);
  }
});

historyToggle.addEventListener("click", function () {
  transactionList.classList.toggle("hidden");
  historyElementCreator(history.transactionHistory, transactionList);
});

filtercheckButns.forEach((btn) => {
  btn.addEventListener("change", () => {
    const value = btn.value;
    const today = new Date();

    let filtered = [];

    if (value === "all") {
      filtered = history.transactionHistory;
    } else {
      let fromDate = new Date();

      if (value === "lastWeek") {
        fromDate.setDate(today.getDate() - 7);
      } else if (value === "lastMonth") {
        fromDate.setMonth(today.getMonth() - 1);
      }

      filtered = history.transactionHistory.filter((tx) => {
        const txDate = new Date(tx.date);
        return txDate >= fromDate && txDate <= today;
      });
    }

    historyElementCreator(filtered, transactionList);
  });
});

// clearStorage() ;
