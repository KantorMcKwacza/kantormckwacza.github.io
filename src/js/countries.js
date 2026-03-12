// const countryApiUrl = 'https://restcountries.com/v3.1/all';
// const withThose     = '?fields=';
// const fields        = 'cca3,flag,name,currencies'
//

fetch(countryApiUrl + withThose + fields)
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(responseData => {
  const originList = calcForm.origin;
  const targetList = calcForm.target;

  const countries = responseData;
  for(let country of countries) {
    let name = country.cca3;
    let fullName = country.name.common;
    let flag = country.flag;
    let currency = Object.keys(country.currencies)[0];
    let currencySymbol = country.currencies.symbol;

    let option = document.createElement('option');
    option.value = country.name;
    option.innerText = flag + ' ' + name;

    let originOption = option;
    let targetOption = option.cloneNode(true);

    originList.appendChild(originOption);
    targetList.appendChild(targetOption);
  }
})
.catch(error => {
  console.error('Error:', error);
});
