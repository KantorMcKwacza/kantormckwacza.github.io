
// TODO: Dodać klase Wydatki i umieścić w niej funkcje


const expensesTable     = document.getElementById('expenses-table');
const expensesTableBody = document.getElementById('expenses-table-body');
const newExpense        = document.getElementById('new-expense');
const expenseForm       = document.getElementById('expense-form');
const sumValue          = document.getElementById('sum-value');

let currentExpenseNumber = 1;

let countryList = expenseForm.country;
populateWithCountries(countryList, true);

function showExpenseForm() {
  newExpense.removeAttribute('hidden');
}
function hideExpenseForm() {
  newExpense.hidden = 'hidden';
}

function createExpenseEntry() {
  let country  = expenseForm.country.value;
  let name     = expenseForm.name.value;
  let value    = expenseForm.value.valueAsNumber;
  let currency = expenseForm.currency.value;

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
  thValue.innerText    = value;
  thCurrency.innerText = currency;

  tr.appendChild(thNum);
  tr.appendChild(thCountry);
  tr.appendChild(thName);
  tr.appendChild(thValue);
  tr.appendChild(thCurrency);

  tbody.appendChild(tr);

  currentExpenseNumber += 1;
}

expenseForm.addEventListener('submit', (event) => {
  createExpenseEntry();

  expenseForm.reset();
  hideExpenseForm();
  event.preventDefault();
})
