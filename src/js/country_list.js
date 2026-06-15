
const countryList    = document.getElementById('country-list');
const pageList       = document.getElementById('page-list');
const countrySection = document.getElementById('country-details');
const listSection    = document.getElementById('list-section');

// Elementy do których wpisywane są informacje o wybranym kraju
const cName       = document.getElementById('country-name');
const cFlag       = document.getElementById('flag-img');
const cCapital    = document.getElementById('capital');
const cPopulation = document.getElementById('population');
const cArea       = document.getElementById('area');
const cBorders    = document.getElementById('borders');
const cLanguages  = document.getElementById('languages');
const cCurrencies = document.getElementById('dt-currencies');
const cContinents = document.getElementById('continents');
const cTimezones  = document.getElementById('timezones');
const cRoadSide   = document.getElementById('road-side');
const cMap        = document.getElementById('map-link');

let currentPage = 1;
let currentCountry = undefined;

getParameters();
paginateList();
showCountry();

/**
 * Przetwarza parametry url.
 * - `country=[kod kraju]` zapisuje pod zmienną `currentCountry`
 * - `page=[numer strony]` zapisuje pod zmienną `currentPage`
 */
function getParameters() {
  let urlString = window.location.href;
  let paramString = urlString.split('?')[1];
  let queryString = new URLSearchParams(paramString);
  for(let pair of queryString.entries()) {
    let key   = pair[0];
    let value = pair[1];

    switch(key) {
      case 'page':
        currentPage = parseInt(value);
        break;
      case 'country':
        currentCountry = value;
        break;
      default:
        break;
    }
  }
}

/**
 * Zmienia widoczność elementu prezentującego wybrany kraj oraz wypełnia go pozyskanymi danymi.
 *
 * Wykorzystuje funkcję {@link getCountryDetails} do pozyskania danych.
 *
 * @see {@link getCountryDetails}
 */
async function showCountry() {
  if(currentCountry === undefined) {
    countrySection.hidden = 'hidden';
    listSection.removeAttribute('hidden');
    return;
  }

  const country = await getCountryDetails(currentCountry);
  if (!country) return;

  cName.innerText       = country.names.translations?.pol?.common || country.names.common;
  cFlag.src             = country.flag.url_png;
  cFlag.alt             = country.flag.alt || country.names.common;
  cCapital.innerText    = country.capitals && country.capitals.length > 0 ? country.capitals[0].name : '-';
  cPopulation.innerText = country.population.toLocaleString('pl-PL');
  cRoadSide.innerHTML   = country.car?.side || '-';
  cMap.href             = country.maps?.open_street_maps || 'https://www.openstreetmap.org';
  cArea.innerText       = (country.area?.kilometers || 0).toLocaleString('pl-PL') + ' km';
  let sup = document.createElement('sup');
  sup.innerText = '2';
  cArea.appendChild(sup);

  let continents = '';
  let comma = ''
  if (country.continents) {
    country.continents.forEach((continent) => {
      if(continents !== '') comma = ', ';
      continents = continents + comma + continent;
    });
  }
  cContinents.innerText = continents || '-';

  let timezones = '';
  comma = ''
  if (country.timezones) {
    country.timezones.forEach((timezone) => {
      if(timezones !== '') comma = ', ';
      timezones = timezones + comma + timezone;
    });
  }
  cTimezones.innerText = timezones || '-';

  /* sasiednie kraje przecinki */
  cBorders.innerHTML = '<summary> Kraje graniczące: </summary>';
  if (country.borders && country.borders.length > 0) {
    country.borders.forEach((border, index) => {
      let a = document.createElement('a');
      a.href = "?country=" + border + "&page=" + currentPage;
      a.innerText = border;
      cBorders.appendChild(a);

      if (index < country.borders.length - 1) {
        cBorders.appendChild(document.createTextNode(', '));
      }
    });
  } else {
    cBorders.innerText = 'Brak';
  }

  /* waluty przecinki */
  cCurrencies.innerHTML = '<summary> Waluty: </summary>';
  if (country.currencies) {
    country.currencies.forEach((curr, index) => {
      let span = document.createElement('span');
      span.innerText = curr.name + ' [' + curr.symbol + ']';
      cCurrencies.appendChild(span);

      if (index < country.currencies.length - 1) {
        cCurrencies.appendChild(document.createTextNode(', '));
      }
    });
  }

  /* jezyki przecinki */
  cLanguages.innerHTML = '<summary> Języki: </summary>';
  if (country.languages) {
    country.languages.forEach((lang, index) => {
      let span = document.createElement('span');
      span.innerText = lang.name;
      cLanguages.appendChild(span);

      if (index < country.languages.length - 1) {
        cLanguages.appendChild(document.createTextNode(', '));
      }
    });
  }

  countrySection.removeAttribute('hidden');
  listSection.hidden = 'hidden';
}

/**
 * Ukrywa element prezentujący wybrany kraj oraz usuwa parametr country z url.
 */
function hideCountry() {
  countrySection.hidden = 'hidden';
  listSection.removeAttribute('hidden');
  const url = new URL(window.location.href);
  const params = url.searchParams;
  console.log(params);
  if(params.has('country')) {
    params.delete('country');
    url.search = params.toString();
    window.location.href = url.toString();
  }
}
