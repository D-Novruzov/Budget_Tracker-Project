import { API } from "./config.js";
import { currencies } from "./config.js";
import { state } from "./state.js";

export const storageManager = function (action, key, value) {
  if (action === "set") {
    localStorage.setItem(key, JSON.stringify(value));
  } else {
    return JSON.parse(localStorage.getItem(key));
  }
};

export const clearStorage = function () {
  localStorage.clear();
};

export const fetchAPI = async function (base, to, amount) {
  try {
    const response = await fetch(
      `${API}&from=${base}&to=${to}&amount=${amount}`
    );
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    if (!data.success)
      throw new Error(data.error?.info || "API returned an error");

    return data;
  } catch (err) {
    console.error("API fetch error:", err);
    throw err;
  }
};

// export const parser = function (key) {
//   const value = storageManager("get", key); // ✅ safe here
//   return parseFloat(value) || 0;
// };

export const contentChanger = function (name) {
  return `${currencies[state.selectedCurrency]}${name.toFixed(2)}`;
};
