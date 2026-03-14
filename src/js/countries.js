
async function populateWithCountries(selectElement, childType, getFullName = false) {
  let fields = 'cca3,flag,name,currencies,translations'

  return await fetch(countriesApiUrl + withThose + fields)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(responseData => {
    const countries = responseData;
    for(let country of countries) {
      let name = country.cca3;
      let visibleName = name;
      if(getFullName)
        visibleName = country.translations.pol.common; //country.name.common;
      let flag = country.flag;

      let child = document.createElement(childType);
      child.value = name;
      child.innerText = flag + ' ' + visibleName;

      selectElement.appendChild(child);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function insertCountryCurrency(nameElement, symbolElement, codeElement, countryCode) {
  let fields = 'currencies'

  fetch(countryByCodeApiUrl + '/' + countryCode + withThose + fields)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(responseData => {
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
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
