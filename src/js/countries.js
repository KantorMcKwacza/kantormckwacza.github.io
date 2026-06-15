async function populateWithCountries(elementsArray, childType, getFullName = false) {
  let fields = 'codes,flag,names,geography';

  return await fetch(countriesApiUrl + withThose + fields, { headers: countryApiHeaders })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(responseData => {
      let countries = responseData.data || responseData;
      if (!Array.isArray(countries)) countries = [countries];

      countries.sort((a, b) => {
        let nameA = getFullName ? (a.names.translations?.pol?.common || a.names.common) : a.codes.alpha_3;
        let nameB = getFullName ? (b.names.translations?.pol?.common || b.names.common) : b.codes.alpha_3;

        return nameA.localeCompare(nameB, "pl");
      });

      for (let country of countries) {
        let name = country.codes.alpha_3;
        let visibleName = name;
        if (getFullName)
          visibleName = country.names.translations?.pol?.common || country.names.common;
        let flag = country.flag.emoji;

        let child = document.createElement(childType);
        child.value = name;
        child.innerText = flag + ' ' + visibleName;
        child.id = `country/${name}`;

        child.setAttribute('data-region', country.geography?.region || 'Unknown');

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

  fetch(countryByCodeApiUrl + '/' + countryCode + withThose + fields, { headers: countryApiHeaders })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(responseData => {
      const country = Array.isArray(responseData) ? responseData[0] : (responseData.data || responseData);
      if (!country || !country.currencies || country.currencies.length === 0) {
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

      let currency = country.currencies[0];
      let currencyCode = currency.code;
      let currencyName = currency.name;
      let currencySymbol = currency.symbol;

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
  let fields = 'capitals,borders,area,geography,population,car,timezones,continents,currencies,languages,flag,names,maps';

  return await fetch(countryByCodeApiUrl + '/' + countryCode + withThose + fields, { headers: countryApiHeaders })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(responseData => {
      const data = Array.isArray(responseData) ? responseData[0] : (responseData.data || responseData);
      if (data === undefined) {
        console.warn('Invalid or missing country code!');
      } else {
        return data;
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

async function fillCurrencyList(currencyList) {
  let fields = 'codes,currencies';

  fetch(countriesApiUrl + withThose + fields, { headers: countryApiHeaders })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(responseData => {
      const countries = responseData.data || responseData;
      if (!Array.isArray(countries)) return;
      
      for (let country of countries) {
        let name = country.codes.alpha_3;
        if (!country.currencies || country.currencies.length === 0) {
          console.info("No currency for", name);
          continue
        }
        let currency = country.currencies[0];
        let currencyCode = currency.code;
        let currencySymbol = currency.symbol;

        currencyList[name] = { 'code': currencyCode, 'symbol': currencySymbol };
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}