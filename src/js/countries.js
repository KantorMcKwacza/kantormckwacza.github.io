async function populateWithCountries(elementsArray, childType, getFullName = false) {
  let fields = 'codes.alpha_3,flag.emoji,names.common,currencies,names.translations,region&limit=100&offset=1';

  return await fetch(countriesApiUrl + withThose + fields , { headers: countryApiHeaders })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(responseData => {
      let countries = responseData.data.objects; 

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
        child.setAttribute('data-region', country.region || 'Unknown'); 

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

  fetch(countryByCodeApiUrl + '/' + countryCode + withThose + fields , { headers: countryApiHeaders })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(responseData => {
      const country = responseData.data.objects[0]; 

      if (!country?.currencies || country.currencies.length === 0) {
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
      nameElement.value = currency.name;
      symbolElement.value = currency.symbol;
      codeElement.value = currency.code;
      if (warningBox) warningBox.hidden = true;
    })
    .catch(error => console.error('Error:', error));
}

async function getCountryDetails(countryCode) {
  let fields = 'capitals,borders,area,links,population,cars,timezones,continents,currencies,languages,flag,names.translations,names.common';

  return await fetch(countryByCodeApiUrl + '/' + countryCode + withThose + fields, { headers: countryApiHeaders })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(responseData => {
      if (!responseData?.data?.objects?.[0]) {
        console.warn('Invalid or missing country code!');
      } else {
        return responseData.data.objects[0]; 
      }
    })
    .catch(error => console.error('Error:', error));
}

async function fillCurrencyList(currencyList) {
  let fields = 'codes.alpha_3,currencies';

  fetch(countriesApiUrl + withThose + fields, { headers: countryApiHeaders })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(responseData => {
      const countries = responseData.data.objects; 

      for (let country of countries) {
        let name = country.codes.alpha_3;

        if (!country.currencies || country.currencies.length === 0) {
          console.info("No currency for", name);
          continue;
        }
        let currency = country.currencies[0];
        currencyList[name] = { 'code': currency.code, 'symbol': currency.symbol };
      }
    })
    .catch(error => console.error('Error:', error));
}
