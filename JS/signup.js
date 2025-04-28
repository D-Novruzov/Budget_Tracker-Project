import { storageManager } from "./helpers.js";

document.addEventListener("DOMContentLoaded", () => {
  let users = storageManager("get", "users") || [];

  const signUpForm = document.querySelector("#signupForm");

  if (!signUpForm) {
    console.error("Signup form not found!");
    return;
  }

  signUpForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    let user = {
      username: username,
      password: password,
      history: {
        transactionHistory: [],
        totalIncome: 0,
        totalExpenses: 0,
        currentBal: 0,
      },
    };

    users.push(user);
    storageManager("set", "users", users);

    window.location.href = "./login.html";
  });
});
