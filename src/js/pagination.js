/**
 * Zapełnia listę krajów i tworzy paginację strony.
 *
 * Wywołuje kolejno funkcje:
 * @see {@link populateWithCountries}
 * @see {@link createPagesList}
 * @see {@link linkifyList}
 * @see {@link displayPageList}
 * @see {@link displayPage}
 */
async function paginateList() {
  await populateWithCountries(countryList, 'li', true, true);
  createPagesList();
  linkifyList(countryList);

  displayPageList(currentPage);
  displayPage(currentPage);
}

/**
 * Konwertuje zawartość elementów listy na elementy zawierające link
 *
 * @example
 * `
 * <li id="... /POL">
 *  Polska
 * </li>
 * `
 *             ↓↓↓
 * `
 * <li id="... /POL">
 *  <a href="?country=POL">Polska</a>
 * </li>
 * `
 *
 * @param {HTMLUListElement} list Element listy
 */
function linkifyList(list) {
  const listElements = Array.from(list.getElementsByTagName('li'));

  listElements.forEach((li, index) => {
    const a = document.createElement('a');

    let countryCode = li.id.split('/')[1];
    let text = li.innerText;
    li.innerText = '';
    page = window.location.href.split('page=')[1];
    if(page == undefined)
      page = ''
    else
      page = '&page=' + page;

    a.innerText = text;
    a.href = "?country=" + countryCode + page;

    li.appendChild(a);
  });
}

/**
 * Zmienia stronę na następną
 * @see {@link switchPageRelative}
 */
function nextPage() {
  switchPageRelative(1);
}
/**
 * Zmienia stronę na poprzednią
 * @see {@link switchPageRelative}
 */
function prevPage() {
  switchPageRelative(-1);
}

/**
 * Zmienia stronę o `pageShift` stron, relatywnie do aktualnej.
 *
 * @example
 * //Aktualna strona: 5
 * switchPageRelative(-3);
 * //Aktualna strona: 2
 */
function switchPageRelative(pageShift) {
  if(isNaN(pageShift)) {
    console.warn("Warning:", "Invalid page shift!");
    return;
  }

  let firstPage = 1;
  let lastPage  = pageList.getElementsByTagName('li').length - 2;

  if(currentPage + pageShift >= lastPage)
    currentPage = lastPage;
  else if(currentPage + pageShift <= firstPage)
    currentPage = firstPage;
  else
    currentPage += pageShift;

  let urlString          = window.location.href;
  let urlParamSplit      = urlString.split('?');
  let baseUrl            = urlParamSplit[0];
  let paramString        = urlParamSplit[1];
  let queryString        = new URLSearchParams(paramString);
  let alteredParamString = "";

  for(let pair of queryString.entries()) {
    let key   = pair[0];
    let value = pair[1];

    switch(key) {
      case 'page':
        value = currentPage;
        break;
      default:
        break;
    }
    if(alteredParamString === "")
      alteredParamString = key + '=' + value;
    else
      alteredParamString = alteredParamString + '&' + key + '=' + value;
  }

  window.location.href = baseUrl + '?' + alteredParamString;
}


/**
 * Tworzy listę elementów paginacji zależnie od liczby stron.
 *
 * @see {@link createPage}
 */
function createPagesList() {
  const countriesNumber = countryList.getElementsByTagName('li').length;

  let pagesNumber = countriesNumber / countriesPerPage;
  if(pagesNumber !== Math.trunc(pagesNumber)) {
    pagesNumber += 1;
  }

  const nextPage = pageList.removeChild(pageList.lastElementChild);

  for(let p = 1; p <= pagesNumber; p++) {
    let page = createPage(p);
    if(page === -1) break;
    pageList.appendChild(page);
  }
  pageList.appendChild(nextPage);
}

/**
 * Tworzy element paginacji o numerze `pageNumber`.
 *
 * @param {number} pageNumber Numer strony do której przenosi stworzony element
 */
function createPage(pageNumber) {
  if(isNaN(pageNumber)) {
    console.warn("Warning:", "pageNumber is not a number!");
    return -1;
  }
  const li   = document.createElement('li');
  const a    = document.createElement('a');
  const span = document.createElement('span');

  span.class     = "visuallyhidden";
  span.innerText = "strona ";

  a.appendChild(span);

  a.href      = "?page=" + pageNumber;
  a.innerText = pageNumber;

  li.appendChild(a);

  return li;
}

/**
 * Ogranicza widoczność elementów paginacji do `pagesDisplayed`.
 *
 * @param {number} page Numer aktualnej strony
 */
function displayPageList(page) {
  const pageElements = Array.from(pageList.getElementsByTagName('li'));
  const lastPage  = pageElements.length - 1;

  const pageShift = Math.trunc(pagesDisplayed / 2);

  let startIndex = page - pageShift;
  let endIndex   = page + pageShift;

  if(startIndex < 1) {
    endIndex   = (endIndex - startIndex) + 1;
    startIndex = 1;
  }
  if(endIndex >= lastPage) {
    let pagesAbove = endIndex - lastPage;
    startIndex = (startIndex - pagesAbove) - 1;
    endIndex = lastPage;
  }

  pageElements.forEach((pageElement, index) => {
    if(index === 0 || index === pageElements.length - 1) {
      pageElement.style.display = 'block';
    } else if (index >= startIndex && index <= endIndex) {
      pageElement.style.display = 'block';
    } else {
      pageElement.style.display = 'none';
    }
  });
}

/**
 * Ogranicza widoczność elementów listy krajów do `countriesPerPage` zależnie od aktualnej strony.
 *
 * @param {number} page Numer aktualnej strony
 */
function displayPage(page) {
  const countryElements = Array.from(countryList.getElementsByTagName('li'));
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
