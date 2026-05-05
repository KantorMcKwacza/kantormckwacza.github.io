
async function populateWithCurrencies(selectElement) {
  let url_A = nbpListApiUrl + '/' + nbpApiTable[0] + nbpApiFormat;
  let url_B = nbpListApiUrl + '/' + nbpApiTable[1] + nbpApiFormat;

  let responseDataTabA = await fetch(url_A)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .catch(error => {
    console.error('Error:', error);
  });


  let responseDataTabB = await fetch(url_B)
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

async function exchangeToFromPLN(currencyCode, direction, value) {
  if(currencyCode === '' || currencyCode === '-') {
    console.warn('Warning:', 'Currency code is empty! Returning 0');
    return 0;
  }
  if(currencyCode == 'PLN') {
    console.info('Info:', 'You are trying to exchange PLN into PLN! Returning value without changes');
    return value;
  }

  let url_A = nbpApiUrl + '/' + nbpApiTable[0] + '/' + currencyCode + nbpApiFormat;
  let url_B = nbpApiUrl + '/' + nbpApiTable[1] + '/' + currencyCode + nbpApiFormat;

  let responseData = await fetch(url_A)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .catch(error => {
    console.info('Info:', 'Currency code not found in table A');
  });

  if(responseData === undefined) {
    responseData = await fetch(url_B)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.info('Info:', 'Currency code not found in table B');
    });
  }

  if(responseData === undefined) {
    console.warn('Warning:', 'Currency could not be found. Returning 0');
    return 0;
  }

  let rateValue = responseData.rates[0].mid;
  let result = value;

  if(direction === exchangeDirection.FROM) {
    result = value / rateValue;
  } else if(direction === exchangeDirection.INTO) {
    result = value * rateValue;
  } else {
    console.warn('Warning:', 'Invalid direction! Returning value without changes');
  }

  return result;
}
