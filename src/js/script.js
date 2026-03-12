const resultPrecision = 2;

const countryApiUrl = 'https://restcountries.com/v3.1/name';

const nbpApiUrl     = 'https://api.nbp.pl/api/exchangerates/rates';
const nbpApiTable   = ['A', 'B'];
const nbpApiFormat  = '?format=json';

let originCountry = 'poland';
let targetCountry = 'germany';

let originCountryCode = 'PLN';
let targetCountryCode = 'EUR';


const calcForm = document.getElementById('calc-form');

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

