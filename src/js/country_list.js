
const countryList    = document.getElementById('country-list');
const pageList       = document.getElementById('page-list');
const countrySection = document.getElementById('country-details');

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

async function showCountry() {
  if(currentCountry === undefined) {
    countrySection.hidden = 'hidden';
    return;
  }

  const country = await getCountryDetails(currentCountry);

  cName.innerText       = country.translations.pol.common;
  cFlag.src             = country.flags.png;
  cFlag.alt             = country.flags.alt;
  cCapital.innerText    = country.capital[0];
  cPopulation.innerText = country.population;
  cRoadSide.innerHTML   = country.car.side;
  cMap.href             = country.maps.openStreetMaps;
  cArea.innerText       = country.area + ' km';
  let sup = document.createElement('sup');
  sup.innerText = '2';
  cArea.appendChild(sup);

  let continents = '';
  let comma = ''
  country.continents.forEach((continent) => {
    if(continents !== '') comma = ', ';
    continents = continents + comma + continent;
  });
  cContinents.innerText = continents;

  let timezones = '';
  comma = ''
  country.timezones.forEach((timezone) => {
    if(timezones !== '') comma = ', ';
    timezones = timezones + comma + timezone;
  });
  cTimezones.innerText = timezones;

  country.borders.forEach((border) => {
    let a = document.createElement('a');
    a.href = "?country=" + border + "&page=" + currentPage;
    a.innerText = border;
    cBorders.appendChild(a);
  });

  for(let code in country.currencies) {
    let span = document.createElement('span');
    let curr = country.currencies[code];
    span.innerText = curr.name + ' [' + curr.symbol + ']';
    cCurrencies.appendChild(span);
  }

  for(let code in country.languages) {
    let span = document.createElement('span');
    span.innerText = country.languages[code];
    cLanguages.appendChild(span);
  }

  countrySection.removeAttribute('hidden');
}

function hideCountry() {
  countrySection.hidden = 'hidden';
}
