const calcForm = document.getElementById('calc-form');
let currencyList = {};
let originCountryCode = '';
let targetCountryCode = '';

fillCurrencyList(currencyList);

populateWithCountries([calcForm.origin, calcForm.target], 'option',true);

async function calculateCurrencyExchange() {
  let value = parseFloat(calcForm.amount.value);
  if(isNaN(value)) {
    calcForm.result.innerText = 0.00;
    return;
  }
  let valueInPLN     = await exchangeToFromPLN(originCountryCode, exchangeDirection.INTO, value);
  let exchangedValue = await exchangeToFromPLN(targetCountryCode, exchangeDirection.FROM, valueInPLN);

  calcForm.result.innerText = exchangedValue.toFixed(resultPrecision);
}

function switchOriginTarget() {
  let t = targetCountryCode;
  targetCountryCode = originCountryCode;
  originCountryCode = t;
  let v = calcForm.target.value;
  calcForm.target.value = calcForm.origin.value;
  calcForm.origin.value = v;
  calculateCurrencyExchange();
}

calcForm.target.addEventListener('change', (event) => {
  if(calcForm.target.value === ''){
    targetCountryCode = '';
  }
  if(currencyList[calcForm.target.value] !== undefined)
    targetCountryCode = currencyList[calcForm.target.value].code;
});

calcForm.origin.addEventListener('change', (event) => {
  if(calcForm.origin.value === ''){
    originCountryCode = '';
  }
  if(currencyList[calcForm.origin.value] !== undefined)
    originCountryCode = currencyList[calcForm.origin.value].code;
});
calcForm.addEventListener('submit', (event) => {
  calculateCurrencyExchange();
  event.preventDefault();
});
calcForm.target.addEventListener('change', (event) => {
  calculateCurrencyExchange();
});
calcForm.origin.addEventListener('change', (event) => {
  calculateCurrencyExchange();
});

calcForm.amount.addEventListener('input', (event) => {
  let input = event.target;
  let value = input.value;
  let cursorPosition = input.selectionStart;
  let originalLength = value.length;
  value = value.replace(',', '.');
  value = value.replace(/[^0-9.]/g, '');
  const parts = value.split('.');
  if(parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('');
  }
  if (parts[0].length > 13) {
    parts[0] = parts[0].substring(0, 13);
    value = parts[0] + (parts[1] !== undefined ? '.' + parts[1] : '');
  }
  if (parts[1] !== undefined && parts[1].length > 2) {
    value = parts[0] + '.' + parts[1].substring(0, 2);
  }
  input.value = value;
  let lengthDifference = originalLength - value.length;
  input.setSelectionRange(cursorPosition - lengthDifference, cursorPosition - lengthDifference);
  calculateCurrencyExchange();
});
