
async function populateWithCurrencies(selectElement) {

  let url = nbpListApiUrl + '/' + nbpApiTable[0] + nbpApiFormat;

  let responseDataTabA = await fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .catch(error => {
    console.error('Error:', error);
  });

  url = nbpListApiUrl + '/' + nbpApiTable[1] + nbpApiFormat;

  let responseDataTabB = await fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .catch(error => {
    console.error('Error:', error);
  });

  let currencyList = responseDataTabA[0].rates.concat(responseDataTabB[0].rates);

  for(let currency of currencyList) {
    let name = currency.currency;
    let code = currency.code;

    let option = document.createElement('option');
    option.value = code;
    option.innerText = name;

    selectElement.appendChild(option);
  }

}

async function convertPLNToCurrency(currencyCode, value) {
  if(currencyCode === '' || currencyCode == 'PLN') { return value; }

  let url = nbpApiUrl + '/' + nbpApiTable[1] + '/' + currencyCode + nbpApiFormat;

  let responseData = await fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .catch(error => {
    console.error('Error:', error);
  });

  let rateValue = responseData.rates[0].mid;
  let result = value * rateValue;

  return result;
}
