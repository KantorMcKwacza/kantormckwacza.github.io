

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
      if(getFullName)
        name = country.name.common;
      let flag = country.flag;

      let option = document.createElement('option');
      option.value = name;
      option.innerText = flag + ' ' + name;

      selectElement.appendChild(option);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

