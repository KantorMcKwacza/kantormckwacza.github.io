
// TODO: Dodać klase Wydatki i umieścić w niej funkcje


const expensesTable     = document.getElementById('expenses-table');
const expensesTableBody = document.getElementById('expenses-table-body');
const newExpense        = document.getElementById('new-expense');
const expenseForm       = document.getElementById('expense-form');
const sumValue          = document.getElementById('sum-value');
const currencyList      = document.getElementById('currency');

let currentExpenseNumber = 1;
let expensesSumInPLN     = 0;

let countryList = expenseForm.country;
populateWithCountries(countryList, true);
updateExpensesSum();

populateWithCurrencies(currencyList);

function showExpenseForm() {
  newExpense.removeAttribute('hidden');
}
function hideExpenseForm() {
  newExpense.hidden = 'hidden';
}

async function updateExpensesSum() {
  let code = currencyList.value;
  let sum = await convertPLNToCurrency(code, expensesSumInPLN);
  sumValue.innerText = Math.round(sum * 10 ** resultPrecision) / (10 ** resultPrecision);
}

function addToExpensesSum(currencyCode, value) {
  if(currencyCode === '') { return; }
  if(currencyCode == 'PLN') {
    expensesSumInPLN += parseInt(value);
    updateExpensesSum();
    return;
  }

  let url = nbpApiUrl + '/' + nbpApiTable[1] + '/' + currencyCode + nbpApiFormat;

  fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(responseData => {
    let rateValue = responseData.rates[0].mid;
    let result = value * rateValue;

    expensesSumInPLN += result;
    updateExpensesSum();
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function createExpenseEntry() {
  let country  = expenseForm.country.options[expenseForm.country.selectedIndex].text;
  let name     = expenseForm.name.value;
  let value    = expenseForm.value.valueAsNumber;
  let symbol   = expenseForm.currencySymbol.value;
  let currency = expenseForm.currencyName.value;
  let code     = expenseForm.currencyCode.value;

  let tbody = expensesTableBody;

  let tr         = document.createElement('tr');
  let thNum      = document.createElement('th');
  let thCountry  = document.createElement('th');
  let thName     = document.createElement('th');
  let thValue    = document.createElement('th');
  let thCurrency = document.createElement('th');

  thNum.innerText      = currentExpenseNumber;
  thCountry.innerText  = country;
  thName.innerText     = name;
  thValue.innerText    = value + ' ' + symbol;
  thCurrency.innerText = currency;

  tr.appendChild(thNum);
  tr.appendChild(thCountry);
  tr.appendChild(thName);
  tr.appendChild(thValue);
  tr.appendChild(thCurrency);

  tbody.appendChild(tr);

  addToExpensesSum(code, value);
  currentExpenseNumber += 1;
}

expenseForm.addEventListener('submit', (event) => {
  createExpenseEntry();

  expenseForm.reset();
  hideExpenseForm();
  event.preventDefault();
});

expenseForm.country.addEventListener('change', (event) => {
  getCountryCurrency(expenseForm.currencyName, expenseForm.currencySymbol, expenseForm.currencyCode, expenseForm.country.value);
});

currencyList.addEventListener('change', (event) => {
  updateExpensesSum();
});
