const resultPrecision = 2;

const exchangeDirection = {
  FROM: true,
  INTO: false
}

const EXPENSECOUNT = 'ecount';
const EXPENSESUM   = 'esum';
const EXPENSEBASE  = 'exp-';

const nbpApiUrl       = 'https://api.nbp.pl/api/exchangerates/rates';
const nbpListApiUrl   = 'https://api.nbp.pl/api/exchangerates/tables';
const nbpApiTable     = ['A', 'B'];
const nbpApiFormat    = '?format=json';

// countries.js
const countryApiUrl         = 'https://restcountries.com/v3.1/name';
const countriesApiUrl       = 'https://restcountries.com/v3.1/all';
const countryByCodeApiUrl   = 'https://restcountries.com/v3.1/alpha';
const withThose             = '?fields=';
// ---
