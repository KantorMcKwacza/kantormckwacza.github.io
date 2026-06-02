class Expenses {
  #expensesTableBody = document.getElementById('expenses-table-body');
  #newExpense         = document.getElementById('new-expense');
  #expenseForm        = document.getElementById('expense-form');
  #sumValue           = document.getElementById('sum-value');
  #currencyList       = document.getElementById('currency');
  #countryList        = this.#expenseForm.country;

  #currentExpenseNumber = 1;
  #expensesSumInPLN     = 0;

  #expenseEntry = {};
  #expensesList = {};

  constructor() {

    this.loadLocalStorage();
}

  
  populateLists() {
    populateWithCountries(this.#countryList, true);
    populateWithCurrencies(this.#currencyList);
  }

  createExpenseEntry() {
    let id       = this.#currentExpenseNumber;
    let selId    = this.#countryList.selectedIndex;
    let country  = this.#countryList.options[selId].text;
    let name     = this.#expenseForm.name.value.substring(0, 40);
    let rawValue = this.#expenseForm.value.valueAsNumber;
    let value    = rawValue > 999999999 ? 999999999 : rawValue;
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

  createExpenseEntryElement(isNotAvailable = false) {
    let tr         = document.createElement('tr');
    let thNum      = document.createElement('th');
    let thCountry  = document.createElement('th');
    let thName     = document.createElement('th');
    let thValue    = document.createElement('th');
    let thCurrency = document.createElement('th');

    if (isNotAvailable) {
      tr.classList.add('no-currency');
    }

    thNum.innerText      = this.#expenseEntry.id;
    thCountry.innerText  = this.#expenseEntry.country;
    thName.innerText     = this.#expenseEntry.name;
    
    if (isNotAvailable) {
      thValue.innerText = "";
    } else {
      thValue.innerText = this.#expenseEntry.value + ' ' + this.#expenseEntry.symbol;
    }
    
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
    this.updateLocalStorage();

    this.renderSortedTable();
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

loadLocalStorage() {
    let expnum = parseInt(localStorage.getItem(EXPENSECOUNT));
    let expsum = parseFloat(localStorage.getItem(EXPENSESUM));

    if(!isNaN(expnum)) this.#currentExpenseNumber = expnum;
    if(!isNaN(expsum)) this.#expensesSumInPLN = expsum;

    
    this.renderSortedTable();
}

  updateLocalStorage() {
    localStorage.setItem(EXPENSECOUNT, this.#currentExpenseNumber);
    localStorage.setItem(EXPENSESUM,   this.#expensesSumInPLN);
    localStorage.setItem(EXPENSEBASE + this.#expenseEntry.id, JSON.stringify(this.#expenseEntry));
  }

clearAllExpenses() {
    if (confirm("Czy na pewno chcesz wyczyścić wszystkie wydatki?")) {
      // Czyszczenie LocalStorage
      for (let i = 1; i < this.#currentExpenseNumber; i++) {
        localStorage.removeItem(EXPENSEBASE + i);
      }
      localStorage.removeItem(EXPENSECOUNT);
      localStorage.removeItem(EXPENSESUM);

      
      this.#currentExpenseNumber = 1;
      this.#expensesSumInPLN = 0;
      this.#expensesList = {};
      this.#expenseEntry = {};

      this.#expensesTableBody.innerHTML = '';
      this.updateSumElement();

      console.info('Tabela została wyczyszczona.');
    }
  }


renderSortedTable() {
    let allExpenses = [];
    
    for (let i = 1; i < this.#currentExpenseNumber; i++) {
        const item = localStorage.getItem(EXPENSEBASE + i);
        if (item) {
            allExpenses.push(JSON.parse(item));
        }
    }

   
    allExpenses.sort((a, b) => {
        return a.country.localeCompare(b.country, 'pl');
    });

    
    this.#expensesTableBody.innerHTML = ''; 
    
   
    allExpenses.forEach(expense => {
      
        this.#expenseEntry = expense; 
        const entryNotAvailable = expense.code === 'N/A' || expense.code === '-';
        this.createExpenseEntryElement(entryNotAvailable); 
    });

    this.updateSumElement();
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