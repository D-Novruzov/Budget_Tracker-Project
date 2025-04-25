"use strict";

import { storageManager } from "./helpers.js";

const username = document.getElementById("username");
const password = document.getElementById("password");
const loginForm = document.querySelector(".login-form");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("it worked");
});
