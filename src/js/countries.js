async function populateWithCountries(elementsArray, childType, getFullName = false) {
  let fields = 'cca3,flag,name,currencies,translations,region';

  return await fetch(countriesApiUrl + withThose + fields)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(responseData => {
      let countries = responseData;

      countries.sort((a, b) => {
        let nameA = getFullName ? a.translations.pol.common : a.cca3;
        let nameB = getFullName ? b.translations.pol.common : b.cca3;

        return nameA.localeCompare(nameB, "pl");
      });

      for (let country of countries) {
        let name = country.cca3;
        let visibleName = name;
        if (getFullName)
          visibleName = country.translations.pol.common;
        let flag = country.flag;

        let child = document.createElement(childType);
        child.value = name;
        child.innerText = flag + ' ' + visibleName;
        child.id = `country/${name}`;

        child.setAttribute('data-region', country.region || 'Unknown');

        if (elementsArray.constructor === Array) {
          for (let element of elementsArray) {
            let clonedChild = child.cloneNode(true);
            element.appendChild(clonedChild);
          }
        } else if (isDOM(elementsArray)) {
          elementsArray.appendChild(child);
        } else {
          console.warn('Warning:', 'Argument elementsArray is not an array of elements nor an element');
        }
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function insertCountryCurrency(nameElement, symbolElement, codeElement, countryCode) {
  let fields = 'currencies'
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
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(responseData => {
      if (responseData === undefined || !responseData.currencies || Object.keys(responseData.currencies).length === 0) {
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

      const country = responseData;
      let currencyCode = Object.keys(country.currencies)[0];
      let currencyName = country.currencies[currencyCode].name;
      let currencySymbol = country.currencies[currencyCode].symbol;

      nameElement.value = currencyName;
      symbolElement.value = currencySymbol;
      codeElement.value = currencyCode;

      if (warningBox) warningBox.hidden = true;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

async function getCountryDetails(countryCode) {
  let fields = 'capital,borders,area,maps,population,car,timezones,continents,currencies,languages,flags,translations';

  return await fetch(countryByCodeApiUrl + '/' + countryCode + withThose + fields)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(responseData => {
      if (responseData === undefined) {
        console.warn('Invalid or missing country code!');
      } else {
        return responseData;
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

async function fillCurrencyList(currencyList) {
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
      for (let country of countries) {
        let name = country.cca3;
        let currencyCode = Object.keys(country.currencies)[0];

        if (currencyCode === undefined) {
          console.info("No currency for", name);
          continue
        }
        let currencySymbol = country.currencies[currencyCode].symbol;

        currencyList[name] = { 'code': currencyCode, 'symbol': currencySymbol };
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}