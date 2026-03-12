let valueInPLN = 0;

async function calculateOriginToPLN() {
  if(originCountryCode === '' || targetCountryCode === '') { return; }
  if(originCountryCode == 'PLN') { valueInPLN = calcForm.amount.valueAsNumber; return; }
  if(originCountryCode == targetCountryCode) { calcForm.result.innerText = calcForm.amount.value + ' ' + originCountryCode; return; }

  let url = nbpApiUrl + '/' + nbpApiTable[1] + '/' + originCountryCode + nbpApiFormat;
  let value = calcForm.amount.valueAsNumber;
  if(isNaN(value)){ value = 0; }

  return await fetch(url)
  .then(response => {
    if (!response.ok) {
      alert(response.statusText);
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(responseData => {
    if(resultPrecision < 0) { throw new Error("Precision of the result cannot be lower than 0"); }

    let rateValue = responseData.rates[0].mid;
    let result = value * rateValue;

    valueInPLN = result;
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

async function calculatePLNToTarget() {
  if(originCountryCode === '' || targetCountryCode === '') { return; }
  if(targetCountryCode == 'PLN') { calcForm.result.innerText = Math.round(valueInPLN * 10 ** resultPrecision) / (10 ** resultPrecision) + ' ' + targetCountryCode; return; }
  if(originCountryCode == targetCountryCode) { return; }

  let url = nbpApiUrl + '/' + nbpApiTable[1] + '/' + targetCountryCode + nbpApiFormat;

  let value = valueInPLN;

  fetch(url)
  .then(response => {
    if (!response.ok) {
      alert(response.statusText);
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(responseData => {
    if(resultPrecision < 0) { throw new Error("Precision of the result cannot be lower than 0"); }

    let rateValue = responseData.rates[0].mid;
    let result = Math.round(value / rateValue * 10 ** resultPrecision) / (10 ** resultPrecision);

    calcForm.result.innerText = result + ' ' + targetCountryCode;
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

async function calculateCurrencyExchange() {
  await calculateOriginToPLN();
  calculatePLNToTarget();
}

calcForm.addEventListener('submit', (event) => {
  calculateCurrencyExchange();
  event.preventDefault();
})

calcForm.target.addEventListener('change', (event) => {
  calculateCurrencyExchange();
})

calcForm.origin.addEventListener('change', (event) => {
  calculateCurrencyExchange();
})

calcForm.amount.addEventListener('input', (event) => {
  calculateCurrencyExchange();
})


