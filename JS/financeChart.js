import { financeChart } from "./script";
import { Chart } from "chart.js/auto";
import { activeUser } from "./script";
export const chartMaker = async function () {
  const data = {
    labels: ["Expenses", "Income"],
    datasets: [
      {
        label: "Your transactions",
        data: [activeUser.history.totalExpense, activeUser.history.totalIncome],
        backgroundColor: ["rgb(255, 99, 132)", "rgb(0, 255, 0)"],
        hoverOffset: 4,
      },
    ],
  };
  new Chart(financeChart, {
    type: "doughnut",
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          enabled: true,
        },
      },
      layout: {
        padding: {
          top: 20,
        },
      },
    },
  });
};
