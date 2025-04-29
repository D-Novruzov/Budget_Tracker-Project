import { storageManager } from "./helpers.js";

document.addEventListener("DOMContentLoaded", () => {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  console.log(users);
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
      userActive: false,
      history: {
        currentBal: 0,
        totalIncome: 0,
        totalExpenses: 0,
        transactionHistory: [],
      },
    };

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    window.location.href = "./index.html";
  });
});
