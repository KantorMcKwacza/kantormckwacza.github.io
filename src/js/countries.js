

function populateWithCountries(selectElement, getFullName = false) {
  let fields = 'cca3,flag,name,currencies'

  fetch(countriesApiUrl + withThose + fields)
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
        visibleName = country.name.common;
      let flag = country.flag;

      let option = document.createElement('option');
      option.value = name;
      option.innerText = flag + ' ' + visibleName;

      selectElement.appendChild(option);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function getCountryCurrency(nameElement, symbolElement, codeElement, countryCode) {
  let fields = 'currencies'

  fetch(countryByCodeApiUrl + '/' + countryCode + withThose + fields)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(responseData => {
    const country = responseData;
    let currencyCode   = Object.keys(country.currencies)[0];
    let currencyName = country.currencies[currencyCode].name;
    let currencySymbol = country.currencies[currencyCode].symbol;

    nameElement.value   = currencyName;
    symbolElement.value = currencySymbol;
    codeElement.value   = currencyCode;
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
