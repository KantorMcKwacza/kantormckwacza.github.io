
const calcForm = document.getElementById('calc-form');

let currencyList = {};

let originCountryCode = '';
let targetCountryCode = '';


fillCurrencyList(currencyList);
populateWithCountries([calcForm.origin, calcForm.target], 'option');


async function calculateCurrencyExchange() {
  let value = calcForm.amount.valueAsNumber;

  if(isNaN(value)) {
    calcForm.result.innerText = 0;
    return;
  }

  let valueInPLN     = await exchangeToFromPLN(originCountryCode, exchangeDirection.INTO, value);
  let exchangedValue = await exchangeToFromPLN(targetCountryCode, exchangeDirection.FROM, valueInPLN);

  calcForm.result.innerText = Math.round(exchangedValue * 10 ** resultPrecision) / (10 ** resultPrecision);
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
})

calcForm.origin.addEventListener('change', (event) => {
  if(calcForm.origin.value === ''){
    originCountryCode = '';
  }
  console.log(currencyList[calcForm.origin.value], currencyList);
  if(currencyList[calcForm.origin.value] !== undefined)
    originCountryCode = currencyList[calcForm.origin.value].code;
})

calcForm.addEventListener('submit', (event) => {
  calculateCurrencyExchange();
  event.preventDefault();
})

calcForm.target.addEventListener('change', (event) => {
  calculateCurrencyExchange();
})

calcForm.origin.addEventListener('change', (event) => {
  calculateCurrencyExchange();
})

calcForm.amount.addEventListener('input', (event) => {
  calculateCurrencyExchange();
})

