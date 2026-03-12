<<<<<<< HEAD
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
=======

calcForm.addEventListener('submit', (event) => {
  let url = nbpApiUrl + '/' + nbpApiTable[0] + '/' + targetCountryCode + nbpApiFormat;

  let value = calcForm.amount.valueAsNumber;

  fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(responseData => {
    if(resultPrecision < 0) { throw new Error("Precision of the result cannot be lower than 0"); }

    let rateValue = responseData.rates[0].mid;
    let result = Math.round(value * rateValue * 10 ** resultPrecision) / (10 ** resultPrecision);

    calcForm.result.innerText = result + ' ' + targetCountryCode;
  })
  .catch(error => {
    console.error('Error:', error);
  });

  event.preventDefault();
})
>>>>>>> 4e0af7b (Dodano listy wyboru kraju pobierane z restcountries api. Przeniesiono kod odpowiedzialny za przeliczanie walut do calculator.js)
