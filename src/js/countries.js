
function populateWithCountries(selectElement, getFullName = false) {
  let fields = 'cca3,flag,name,currencies,translations';

  fetch(countriesApiUrl + withThose + fields)
  .then(response => response.json())
  .then(responseData => {
  
    const sortedCountries = responseData.sort((a, b) => {
      const nameA = a.translations.pol.common || "";
      const nameB = b.translations.pol.common || "";
      return nameA.localeCompare(nameB, 'pl');
    });

    for(let country of sortedCountries) {
      let code = country.cca3;
      
      let visibleName = getFullName ? country.translations.pol.common : code;
      let flag = country.flag;

      let option = document.createElement('option');
      option.value = code;
      option.innerText = flag + ' ' + visibleName;
      selectElement.appendChild(option);
    }
  })
  .catch(error => console.error('Error:', error));
}

function insertCountryCurrency(nameElement, symbolElement, codeElement, countryCode) {
  let fields = 'currencies'
  const warningBox = document.getElementById('currency-warning');
  if(countryCode === '') {
    nameElement.value   = '-';
    symbolElement.value = '';
    codeElement.value   = '';

    if(warningBox) warningBox.hidden = true;

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

if(responseData === undefined || !responseData.currencies || Object.keys(responseData.currencies).length === 0) {
      console.warn('Brak waluty dla tego kraju!');
      
      nameElement.value   = 'NIEDOSTĘPNA'; 
      codeElement.value   = 'N/A';         
      symbolElement.value = '';

      if(warningBox) {
        warningBox.innerText = " Wybrany kraj nie posiada waluty. Wydatek nie zostanie podliczony.";
        warningBox.hidden = false; 
      }
      return; 
    }

    if(responseData === undefined) {
      console.warn('Invalid or missing country code!');
    } else if(Object.keys(responseData.currencies).length === 0) {
      console.info('No currencies found for this country');
    } else {
      const country = responseData;
      let currencyCode   = Object.keys(country.currencies)[0];
      let currencyName = country.currencies[currencyCode].name;
      let currencySymbol = country.currencies[currencyCode].symbol;

      nameElement.value   = currencyName;
      symbolElement.value = currencySymbol;
      codeElement.value   = currencyCode;

      if(warningBox) warningBox.hidden = true;

    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
