const resultPrecision = 2;

/**
 * Kierunek wymiany waluty z PLN lub na PLN.
 * @type {boolean}
 */
const exchangeDirection = {
  FROM: true,
  INTO: false
}

const countriesPerPage = 10;
const pagesDisplayed   = 5;

/**
 * Id zapisanej liczby wydatków w `localStorage`
 * @type {string}
 */
const EXPENSECOUNT = 'ecount';
/**
 * Id zapisanej sumy wydatków w `localStorage`
 * @type {string}
 */
const EXPENSESUM   = 'esum';
/**
 * Id zapisanego wydatku w `localStorage`
 *
 * Schemat id wydatku: `'exp-{numer wydatku}'`
 * @example
 * 'exp-1':'...'
 * 'exp-2':'...'
 * @type {string}
 */
const EXPENSEBASE  = 'exp-';

const nbpApiUrl       = 'https://api.nbp.pl/api/exchangerates/rates';
const nbpListApiUrl   = 'https://api.nbp.pl/api/exchangerates/tables';
const nbpApiTable     = ['A', 'B'];
const nbpApiFormat    = '?format=json';

const countryApiUrl         = 'https://restcountries.com/v3.1/name';
const countriesApiUrl       = 'https://restcountries.com/v3.1/all';
const countryByCodeApiUrl   = 'https://restcountries.com/v3.1/alpha';
const withThose             = '?fields=';
