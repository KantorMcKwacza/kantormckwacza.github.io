async function populateWithCountries(elementsArray, childType, getFullName = false) {
  let fields = 'codes.alpha_3,flag.emoji,names.common,currencies,names.translations,geography.region';

  return await fetch(countriesApiUrl + withThose + fields)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(responseData => {
      let countries = responseData;

      countries.sort((a, b) => {
        let nameA = getFullName ? a.names.translations.pol.common : a.codes.alpha_3;
        let nameB = getFullName ? b.names.translations.pol.common : b.codes.alpha_3;
        return nameA.localeCompare(nameB, "pl");
      });

      for (let country of countries) {
        let name = country.codes.alpha_3;
        let visibleName = name;
        if (getFullName)
          visibleName = country.names.translations.pol.common;
        let flag = country.flag.emoji;

        let child = document.createElement(childType);
        child.value = name;
        child.innerText = flag + ' ' + visibleName;
        child.id = `country/${name}`;
        child.setAttribute('data-region', country.geography.region || 'Unknown');

        if (elementsArray.constructor === Array) {
          for (let element of elementsArray) {
            element.appendChild(child.cloneNode(true));
          }
        } else if (isDOM(elementsArray)) {
          elementsArray.appendChild(child);
        } else {
          console.warn('Warning:', 'Argument elementsArray is not an array of elements nor an element');
        }
      }
    })
    .catch(error => console.error('Error:', error));
}

function insertCountryCurrency(nameElement, symbolElement, codeElement, countryCode) {
  let fields = 'currencies';
  const warningBox = document.getElementById('currency-warning');

  if (countryCode === '') {
    nameElement.value = '-';
    symbolElement.value = '';
    codeElement.value = '';
    if (warningBox) warningBox.hidden = true;
    return;
  }

  fetch(countryByCodeApiUrl + '/' + countryCode + withThose + fields)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(responseData => {
      if (!responseData?.currencies || Object.keys(responseData.currencies).length === 0) {
        console.warn('Brak waluty dla tego kraju!');
        nameElement.value = 'NIEDOSTĘPNA';
        codeElement.value = 'N/A';
        symbolElement.value = '';
        if (warningBox) {
          warningBox.innerText = " Wybrany kraj nie posiada waluty. Wydatek nie zostanie podliczony.";
          warningBox.hidden = false;
        }
        return;
      }

      let currencyCode = Object.keys(responseData.currencies)[0];
      let currencyName = responseData.currencies[currencyCode].name;
      let currencySymbol = responseData.currencies[currencyCode].symbol;

      nameElement.value = currencyName;
      symbolElement.value = currencySymbol;
      codeElement.value = currencyCode;
      if (warningBox) warningBox.hidden = true;
    })
    .catch(error => console.error('Error:', error));
}

async function getCountryDetails(countryCode) {
  let fields = 'geography.capital,geography.borders,geography.area,geography.maps,demographics.population,transport.car,geography.timezones,geography.continents,currencies,demographics.languages,flag,names.translations';

  return await fetch(countryByCodeApiUrl + '/' + countryCode + withThose + fields)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(responseData => {
      if (!responseData) {
        console.warn('Invalid or missing country code!');
      } else {
        return responseData;
      }
    })
    .catch(error => console.error('Error:', error));
}

async function fillCurrencyList(currencyList) {
  let fields = 'codes.alpha_3,currencies';

  fetch(countriesApiUrl + withThose + fields)
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(responseData => {
      for (let country of responseData) {
        let name = country.codes.alpha_3;
        let currencyCode = Object.keys(country.currencies)[0];

        if (currencyCode === undefined) {
          console.info("No currency for", name);
          continue;
        }
        let currencySymbol = country.currencies[currencyCode].symbol;
        currencyList[name] = { 'code': currencyCode, 'symbol': currencySymbol };
      }
    })
    .catch(error => console.error('Error:', error));
}