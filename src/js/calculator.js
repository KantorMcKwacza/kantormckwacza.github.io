
const expenses = new Expenses();

expenses.loadLocalStorage();
expenses.populateLists();

expenses.form.addEventListener('submit', (event) => {
  expenses.createExpenseEntry();
  expenses.createExpenseEntryElement();

  expenses.addEntryValueToSum();
  //expenses.updateSumElement();
  //expenses.updateLocalStorage();

  expenses.form.reset();
  expenses.hideExpenseForm();
  event.preventDefault();
});

expenses.countryList.addEventListener('change', (event) => {
  insertCountryCurrency(expenses.form.currencyName,
                        expenses.form.currencySymbol,
                        expenses.form.currencyCode,
                        expenses.countryList.value);
});

expenses.currencyList.addEventListener('change', (event) => {
  expenses.updateExpensesSum();
});
