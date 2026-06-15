const resultPrecision = 2;

const exchangeDirection = {
  FROM: true,
  INTO: false
}

const countriesPerPage = 10;
const pagesDisplayed   = 5;

const EXPENSECOUNT = 'ecount';
const EXPENSESUM   = 'esum';
const EXPENSEBASE  = 'exp-';

const nbpApiUrl       = 'https://api.nbp.pl/api/exchangerates/rates';
const nbpListApiUrl   = 'https://api.nbp.pl/api/exchangerates/tables';
const nbpApiTable     = ['A', 'B'];
const nbpApiFormat    = '?format=json';


const countriesApiUrl       = 'https://api.restcountries.com/countries/v5/';
const countryApiUrl         = 'https://api.restcountries.com/countries/v5/names.common/';
const countryByCodeApiUrl   = 'https://api.restcountries.com/countries/v5/codes.alpha_3/';
const countryApiHeaders = {
  'Authorization': 'Bearer rc_live_a142bfdf0f9d44cabeb9f57299c52386'
};
const withThose             = '?response_fields='; 

function isDOM(Obj) {
  return Obj instanceof Element;
}