class Expenses {
  #expensesTableBody = document.getElementById('expenses-table-body');
  #newExpense        = document.getElementById('new-expense');
  #expenseForm       = document.getElementById('expense-form');
  #sumValue          = document.getElementById('sum-value');
  #currencyList      = document.getElementById('currency');
  #countryList       = this.#expenseForm.country;

  #currentExpenseNumber = 1;
  #expensesSumInPLN     = 0;

  #expenseEntry = {};
  #expensesList = {};

  constructor() {
  }

  populateLists() {
    populateWithCountries(this.#countryList, true);
    populateWithCurrencies(this.#currencyList);
  }

  createExpenseEntry() {
    let id       = this.#currentExpenseNumber;
    let selId    = this.#countryList.selectedIndex;
    let country  = this.#countryList.options[selId].text;
    let name     = this.#expenseForm.name.value;
    let value    = this.#expenseForm.value.valueAsNumber;
    let symbol   = this.#expenseForm.currencySymbol.value;
    let currency = this.#expenseForm.currencyName.value;
    let code     = this.#expenseForm.currencyCode.value;

    this.#expenseEntry = {
      "id": id,
      "country": country,
      "name": name,
      "value": value,
      "symbol": symbol,
      "currency": currency,
      "code": code
    };

    this.#expensesList[id] = this.#expenseEntry;
    this.#currentExpenseNumber += 1;
  }

  createExpenseEntryElement() {
    let tr         = document.createElement('tr');
    let thNum      = document.createElement('th');
    let thCountry  = document.createElement('th');
    let thName     = document.createElement('th');
    let thValue    = document.createElement('th');
    let thCurrency = document.createElement('th');

    thNum.innerText      = this.#expenseEntry.id;
    thCountry.innerText  = this.#expenseEntry.country;
    thName.innerText     = this.#expenseEntry.name;
    thValue.innerText    = this.#expenseEntry.value + ' ' + this.#expenseEntry.symbol;
    thCurrency.innerText = this.#expenseEntry.currency;

    tr.appendChild(thNum);
    tr.appendChild(thCountry);
    tr.appendChild(thName);
    tr.appendChild(thValue);
    tr.appendChild(thCurrency);

    this.#expensesTableBody.appendChild(tr);
  }

  async addEntryValueToSum() {
    let entry = this.#expenseEntry;
    let currencyCode = entry.code;
    let value = entry.value;

    this.#expensesSumInPLN += await exchangeToFromPLN(currencyCode, exchangeDirection.INTO, value);

    this.updateSumElement();
  }

  async updateSumElement() {
    let code = this.#currencyList.value;
    let sum = await exchangeToFromPLN(code, exchangeDirection.FROM, this.#expensesSumInPLN);

    if(sum === 0) {
      console.warn('Warning:', 'Exchange aborted. Expense will not be counted in sum');
      return;
    }

    this.#sumValue.innerText = Math.round(sum * 10 ** resultPrecision) / (10 ** resultPrecision);
  }

  updateLocalStorage() {

  }

  get form() {
    return this.#expenseForm;
  }
  get currencyList() {
    return this.#currencyList;
  }
  get countryList() {
    return this.#countryList;
  }

  showExpenseForm() {
    this.#newExpense.removeAttribute('hidden');
  }
  hideExpenseForm() {
    this.#newExpense.hidden = 'hidden';
  }
}
