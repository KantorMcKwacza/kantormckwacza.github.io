async function populateWithCurrencies(selectElement) {
  let url_A = nbpListApiUrl + '/' + nbpApiTable[0] + nbpApiFormat;
  let url_B = nbpListApiUrl + '/' + nbpApiTable[1] + nbpApiFormat;

  try {
    const [resA, resB] = await Promise.all([
      fetch(url_A).then(r => r.json()),
      fetch(url_B).then(r => r.json())
    ]);

    let currencyList = resA[0].rates.concat(resB[0].rates);

    currencyList.sort((a, b) => a.currency.localeCompare(b.currency, 'pl'));

    selectElement.innerHTML = '';

    let plnOption = document.createElement('option');
    plnOption.value = 'PLN';
    plnOption.innerText = 'polski złoty (PLN)';
    selectElement.appendChild(plnOption);

    for (let currency of currencyList) {
      let option = document.createElement('option');
      option.value = currency.code;

      option.innerText = currency.currency + ' (' + currency.code + ')';
      selectElement.appendChild(option);
    }

  } catch (error) {
    console.error('Błąd podczas pobierania walut:', error);
  }
}

async function exchangeToFromPLN(currencyCode, direction, value) {
  if (currencyCode === '' || currencyCode === '-') {
    console.warn('Warning:', 'Currency code is empty! Returning 0');
    return 0;
  }
  if (currencyCode == 'PLN') {
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

  if (responseData === undefined) {
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

  if (responseData === undefined) {
    console.warn('Warning:', 'Currency could not be found. Returning 0');
    return 0;
  }

  let rateValue = responseData.rates[0].mid;
  let result = value;

  if (direction === exchangeDirection.FROM) {
    result = value / rateValue;
  } else if (direction === exchangeDirection.INTO) {
    result = value * rateValue;
  } else {
    console.warn('Warning:', 'Invalid direction! Returning value without changes');
  }

  return result;
}