/* Name: Shane Abraham
ID: 8895137 */

let graphChart = null;
let barChart = null;
let pieChart = null;
let loanAmount = 0;
let monthlyPayment = 0;
let monthlyInterestRate = 0;
let totalPayments = 0;

//getting input field elements
const loanAmountField = document.getElementById("loan-amount");
const interestRateField = document.getElementById("interest-rate");
const loanDuarationField = document.getElementById("loan-duration");
const loanDateField = document.getElementById("loan-date");
const downPaymentField = document.getElementById("down-payment-percentage");
const interestRateErrmsg = document.getElementById("interest-rate-errMsg");
const downPaymentErrmsg = document.getElementById("down-payment-errMsg");

loanAmountField.focus()

//span elements for output
const monthlyPaymentResult = document.getElementById("monthly-payment");
const totalPaymentResult = document.getElementById("total-payment");
const downPaymentAmountResult = document.getElementById("down-payment-amount");
const totalPaymentAfterDownPaymentResult = document.getElementById(
  "total-payment-after-down-payment"
);
const totalInterestAfterDownPaymentResult = document.getElementById(
  "total-interest-after-down-payment"
);

//Displaying default values
interestRateField.value = 5;
loanDuarationField.value = 2;
downPaymentField.value = 20;
let today = new Date();
loanDateField.value =
  today.getFullYear() +
  "-" +
  ("0" + (today.getMonth() + 1)).slice(-2) +
  "-" +
  ("0" + today.getDate()).slice(-2);

function formatNumberWithCommas(number) {
  // Convert the number to a string
  const numStr = number.toString();

  // Split the string into integer and decimal parts (if any)
  const [integerPart, decimalPart] = numStr.split(".");

  // Format the integer part with commas
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // If there is a decimal part, add it back to the formatted integer
  const formattedNumber = decimalPart
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;

  return formattedNumber;
}


//This event listener gets all the inputs and calculates the results
document.getElementById("loan-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const amortizationData = [];

  const labels = [];

  const data = [];

  let totalInterestAmount = 0;

  loanAmount = parseFloat(loanAmountField.value);
  const interestRate = parseFloat(interestRateField.value);
  const loanDuration = parseFloat(loanDuarationField.value);

  // Get the loan date from the input field
  const loanDate = new Date(loanDateField.value);

  const downPaymentPercentage = parseFloat(downPaymentField.value);


  // Validating inputs
  if (
    isNaN(loanAmount) ||
    isNaN(interestRate) ||
    isNaN(loanDuration) ||
    isNaN(downPaymentPercentage)
  ) {
    alert("Please enter valid numeric values for all fields.");
    return;
  }
  

  if (interestRate > 60) {
    // alert("Interest rate cannot exceed 60%");

    interestRateErrmsg.innerHTML = "Interest rate cannot exceed 60%";
    interestRateErrmsg.classList.remove("hidden");
    return;
  } else {
    interestRateErrmsg.classList.add("hidden");
  }

  if (downPaymentPercentage > 100) {
    // alert("Down payment percentage cannot exceed 100%");
    downPaymentErrmsg.innerHTML = "Down payment percentage cannot exceed 100%";
    downPaymentErrmsg.classList.remove("hidden");
    return;
  } else {
    downPaymentErrmsg.classList.add("hidden");
  }


  // Calculations for inputs
  const downPaymentAmount = (downPaymentPercentage / 100) * loanAmount;
  let remaining = loanAmount - downPaymentAmount;

  monthlyInterestRate = interestRate / (12 * 100);
  totalPayments = loanDuration * 12;

  monthlyPayment =
    (remaining * monthlyInterestRate) /
    (1 - Math.pow(1 + monthlyInterestRate, -totalPayments));

  for (let i = 1; i <= totalPayments; i++) {
    const interestPayment = remaining * monthlyInterestRate;
    const principalPayment = monthlyPayment - interestPayment;
    remaining -= principalPayment;
    const monthYear = getMonthYear(loanDate, i);
    labels.push(monthYear);

    totalInterestAmount += interestPayment;
    amortizationData.push({
      month: monthYear,
      principal: "$" + principalPayment.toFixed(2),
      interest: "$" + interestPayment.toFixed(2),
      remainingmount: "$" + Math.abs(remaining.toFixed(2)),
    });

    data.push({
      principal: principalPayment.toFixed(2),
      interest: interestPayment.toFixed(2),
      remainingmount: remaining.toFixed(2),
    });
  }

  // Displaying the data
  monthlyPaymentResult.textContent =
    "$" + formatNumberWithCommas(monthlyPayment.toFixed(2));
  totalPaymentResult.textContent =
    "$" + formatNumberWithCommas((monthlyPayment * totalPayments).toFixed(2));
  downPaymentAmountResult.textContent =
    "$" + formatNumberWithCommas(downPaymentAmount.toFixed(2));
  totalPaymentAfterDownPaymentResult.textContent =
    "$" + formatNumberWithCommas((loanAmount - downPaymentAmount).toFixed(2));

  totalInterestAfterDownPaymentResult.textContent =
    "$" + formatNumberWithCommas(totalInterestAmount.toFixed(2));
  document.getElementById("result").classList.remove("hidden");

  // Display the amortization table
  displayAmortizationTable("amortization-table", amortizationData);

  // Show the amortization schedule section
  document.getElementById("amortization-schedule").classList.remove("hidden");

  // Display the graph, bar chart, and table
  displayGraph(labels, data);
  displayBarChart(labels, data);
  displayPieChartPaymentBreakdown(loanAmount, interestRate, downPaymentAmount);
});

document.getElementById("clearContents").addEventListener("click", function () {
  clearFormInputs("loan-form");
});

// Getting month and year from the date
function getMonthYear(startDate, monthOffset) {
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + monthOffset);
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return month + " " + year;
}

//Function to add data and display line chart
function displayGraph(labels, data) {
  const ctx = document.getElementById("graph").getContext("2d");
  const remainingAmount = [];
  const monthlyPayment = [];
  const interestPayment = [];

  for (let i = 0; i < data.length; i++) {
    monthlyPayment.push(data[i].principal);
    interestPayment.push(data[i].interest);
    remainingAmount.push(data[i].remainingmount);
  }

  const graphColor = "blue";

  // Destroy the previous chart if it exists
  if (graphChart) {
    graphChart.destroy();
  }

  //adding data
  graphChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Monthly Payment",
          data: monthlyPayment,
          borderColor: graphColor,
          fill: false,
        },
        {
          label: "Remaining Amount",
          data: remainingAmount,
          borderColor: "green",
          fill: false,
          borderDash: [5, 5],
        },
        {
          label: "Interest Amount",
          data: interestPayment,
          borderColor: "violet",
          fill: false,
          borderDash: [5, 5],
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: "Months",
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "Payment Amount ($)",
          },
        },
      },
    },
  });
}


// Function to add data and display bar chart 
function displayBarChart(labels, data) {
  const ctx = document.getElementById("bar-chart").getContext("2d");
  const remainingAmount = [];
  const monthlyPayment = [];
  const interestPayment = [];

  for (let i = 0; i < data.length; i++) {
    monthlyPayment.push(data[i].principal);
    interestPayment.push(data[i].interest);
    remainingAmount.push(data[i].remainingmount);
  }

  // Destroy the previous chart if it exists
  if (barChart) {
    barChart.destroy();
  }

  barChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Monthly Payment",
          data: monthlyPayment,
          backgroundColor: "blue",
        },
        {
          label: "Interest Amount",
          data: interestPayment,
          backgroundColor: "red",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: "Months",
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "Payment Amount ($)",
          },
        },
      },
    },
  });
}

// Function to add data and display pie chart
function displayPieChartPaymentBreakdown(
  loanAmount,
  interestRate,
  downPaymentAmount
) {
  // Destroy the previous chart if it exists
  if (pieChart) {
    pieChart.destroy();
  }

  const totalInterest = Math.abs(loanAmount * (interestRate / 100));
  // Create the pie chart
  const ctx = document.getElementById("pie-chart").getContext("2d");
  pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Principal Amount", "Total Interest", "Down Payment"],
      datasets: [
        {
          data: [
            loanAmount.toFixed(2),
            totalInterest.toFixed(2),
            downPaymentAmount,
          ],
          backgroundColor: ["#36A2EB", "#FF6384", "#22CFCF"],
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
}

// Function to add data and display amortization table
function displayAmortizationTable(tableId, data1) {
  const table = document.getElementById(tableId);
  table.innerHTML =
    "<tr><th>Month</th><th>Principal Payment</th><th>Interest Payment</th><th>Remaining Amount</th></tr>";

  let totalPrincipal = 0;
  let totalInterest = 0;

  data1.forEach(function (item1) {
    table.innerHTML += `<tr><td>${item1.month}</td><td>${formatNumberWithCommas(
      item1.principal
    )}</td><td>${formatNumberWithCommas(
      item1.interest
    )}</td><td>${formatNumberWithCommas(item1.remainingmount)}</td></tr>`;

    // Calculate the total principal and interest payments
    totalPrincipal += parseFloat(item1.principal.replace("$", ""));
    totalInterest += parseFloat(item1.interest.replace("$", ""));
  });

  // Add the total row
  table.innerHTML += `<tr id="last-row"><td>Total</td><td>$${formatNumberWithCommas(
    totalPrincipal.toFixed(2)
  )}</td><td>$${formatNumberWithCommas(
    totalInterest.toFixed(2)
  )}</td><td></td></tr>`;
}


// Function to reset all inputs
function clearFormInputs(formId) {
  const form = document.getElementById(formId);
  const inputElements = form.getElementsByTagName("input");
  document.getElementById("interest-rate-errMsg").classList.add("hidden");
  document.getElementById("down-payment-errMsg").classList.add("hidden");

  for (let i = 0; i < inputElements.length; i++) {
    const input = inputElements[i];
    if (input.type !== "submit" && input.type !== "button") {
      input.value = "";
    }
  }
}


//Jquery plugin to expand/contract each section
$(document).ready(() => {
  // set event handler for all h3 tags
  $("#result h3").click((evt) => {
    const h3 = evt.currentTarget;

    // toggle minus class for h3 tag
    $(h3).toggleClass("minus");

    // show or hide related div
    if ($(h3).attr("class") !== "minus") {
      $(h3).next().show("slow");
    } else {
      $(h3).next().hide();
    }

    evt.preventDefault();
  });

  $("#amortization-schedule").find("a:first").focus();
});
