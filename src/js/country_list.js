
const countryList = document.getElementById('country-list');



let currentPage = 1;


getParameters();
paginateList();

async function paginateList() {
  await populateWithCountries(countryList, 'li', true);

  displayPage(currentPage);
}

function getParameters() {
  let urlString = window.location.href;
  let paramString = urlString.split('?')[1];
  let queryString = new URLSearchParams(paramString);
  for(let pair of queryString.entries()) {
    let key   = pair[0];
    let value = pair[1];

    switch(key) {
      case 'page':
          currentPage = parseInt(value);
        break;
      case 'country':
        break;
      default:
        break;
    }
  }
}

function displayPage(page) {
  const countryElements = Array.from(countryList.getElementsByTagName('li'));
  console.log(countryElements);
  const startIndex = (page - 1) * countriesPerPage;
  const endIndex = startIndex + countriesPerPage;
  countryElements.forEach((countryElement, index) => {
    if (index >= startIndex && index < endIndex) {
      countryElement.style.display = 'block';
    } else {
      countryElement.style.display = 'none';
    }
  });
}
