import { API } from "./config";
import { currencies } from "./config";
import { state } from "./script";
import { transactionList } from "./script";

export const storageManager = function (action, key, value) {
  if (action === "set") {
    //in order to store the thingsd properly in hte local storage we need to stringify them
    window.localStorage.setItem(key, JSON.stringify(value));
  } else {
    //inorder to get them wwe need to parse aas it is string
    return JSON.parse(window.localStorage.getItem(key));
  }
};
export const clearStorage = function () {
  window.localStorage.clear();
};
//api fetching
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
//parsing fcuntion
export const parser = function (key) {
  return parseFloat(storageManager("get", key)) || 0;
};
//changing the text content
export const contentChanger = function (name) {
  return `${currencies[state.selectedCurrency]}${name.toFixed(2)}`;
};
//transaction history element templete
//
