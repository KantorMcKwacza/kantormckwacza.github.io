

const resultPrecision = 2;

const nbpApiUrl     = 'https://api.nbp.pl/api/exchangerates/rates';
const nbpApiTable   = ['A', 'B'];
const nbpApiFormat  = '?format=json';

// countries.js
// const countryApiUrl = 'https://restcountries.com/v3.1/name';
const countryApiUrl = 'https://restcountries.com/v3.1/all';
const withThose     = '?fields=';
const fields        = 'cca3,flag,name,currencies'
// ---

const calcForm = document.getElementById('calc-form');

let originCountry = 'poland';
let targetCountry = 'germany';

let originCountryCode = 'PLN';
let targetCountryCode = 'EUR';





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

