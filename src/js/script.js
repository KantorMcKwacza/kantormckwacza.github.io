

const resultPrecision = 2;

const nbpApiUrl       = 'https://api.nbp.pl/api/exchangerates/rates';
const nbpApiTable     = ['A', 'B'];
const nbpApiFormat    = '?format=json';

// countries.js
const countryApiUrl   = 'https://restcountries.com/v3.1/name';
const countriesApiUrl = 'https://restcountries.com/v3.1/all';
const withThose       = '?fields=';
// const fields          = 'cca3,flag,name,currencies'
// ---

const calcForm = document.getElementById('calc-form');

let currencyList = {};

// let originCountry = 'poland';
// let targetCountry = 'germany';

let originCountryCode = '';
let targetCountryCode = '';



let fields = 'cca3,currencies';


fetch(countriesApiUrl + withThose + fields)
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(responseData => {
  const countries = responseData;
  for(let country of countries) {
    let name = country.cca3;
    let currencyCode = Object.keys(country.currencies)[0];

    if(typeof currencyCode === 'undefined'){
      console.log("No currency for", name);
      continue
    }
    let currencySymbol = country.currencies[currencyCode].symbol;

    currencyList[name] = {'code': currencyCode, 'symbol': currencySymbol};
  }
})
.catch(error => {
  console.error('Error:', error);
});

calcForm.target.addEventListener('change', (event) => {
  if(calcForm.target.value === ''){
    targetCountryCode = '';
  }
  targetCountryCode = currencyList[calcForm.target.value].code;
})

calcForm.origin.addEventListener('change', (event) => {
  if(calcForm.origin.value === ''){
    originCountryCode = '';
  }
  originCountryCode = currencyList[calcForm.origin.value].code;
})

function switchOriginTarget() {
  let t = targetCountryCode;
  targetCountryCode = originCountryCode;
  originCountryCode = t;

  let v = calcForm.target.value;
  calcForm.target.value = calcForm.origin.value;
  calcForm.origin.value = v;
  calculateCurrencyExchange();
}

// countryForm.addEventListener('submit', (event) => {
//   fetch(countryApiUrl + originCountry)
//   .then(response => {
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return response.json();
//   })
//   .then(userData => {
//     let currency = Object.keys(userData[0].currencies)[0];
//     console.log(currency);
//     calcOutput.innerText = currency;
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });
//
//   event.preventDefault();
// })

