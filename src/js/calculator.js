const expenses = new Expenses();

expenses.loadLocalStorage();
expenses.populateLists();

expenses.form.addEventListener('submit', (event) => {

  const currencyCode = expenses.form.currencyCode.value;
  const isAvailable = currencyCode !== 'N/A' && currencyCode !== '-';

  expenses.createExpenseEntry();
  expenses.createExpenseEntryElement(!isAvailable);

  if (isAvailable) {
    expenses.addEntryValueToSum();
  }

  //expenses.updateSumElement();
  //expenses.updateLocalStorage();

  expenses.form.reset();
  expenses.hideExpenseForm();

  const warningBox = document.getElementById('currency-warning');
  if(warningBox) warningBox.hidden = true;

  event.preventDefault();
});

expenses.countryList.addEventListener('change', (event) => {
  insertCountryCurrency(expenses.form.currencyName,
                        expenses.form.currencySymbol,
                        expenses.form.currencyCode,
                        expenses.countryList.value);
});

expenses.currencyList.addEventListener('change', (event) => {
  expenses.updateSumElement();
});