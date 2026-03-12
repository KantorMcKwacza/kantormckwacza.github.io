// const countryApiUrl = 'https://restcountries.com/v3.1/all';
// const withThose     = '?fields=';
// const fields        = 'cca3,flag,name,currencies'
//

fields = 'cca3,flag,name,currencies'

fetch(countriesApiUrl + withThose + fields)
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

    let option = document.createElement('option');
    option.value = name;
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
