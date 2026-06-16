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
  const header = document.querySelector('header');
  if (header) {
    const observer = new ResizeObserver(entries => {
      const newHeight = entries[0].target.offsetHeight;
      document.documentElement.style.setProperty('--nav-height', `${newHeight}px`);
    });
    observer.observe(header);
  }

  await populateWithCountries(countryList, 'li', true, true);

  createFiltersUI();

  createPagesList();
  linkifyList(countryList);

  displayPageList(currentPage);
  displayPage(currentPage);
}

/**
 * Zmienia stronę od razu na pierwszą
 */
function firstPage() {
  let url = new URL(window.location.href);
  url.searchParams.set('page', 1);
  window.location.href = url.toString();
}

/**
 * Zmienia stronę od razu na ostatnią
 */
function lastPage() {
  const visibleCountries = getVisibleCountries();
  let pagesNumber = Math.ceil(visibleCountries.length / countriesPerPage);
  if (pagesNumber === 0) pagesNumber = 1;

  let url = new URL(window.location.href);
  url.searchParams.set('page', pagesNumber);
  window.location.href = url.toString();
}

let sortDirectionAsc = true; // Zmienna śledząca kierunek sortowania 

/**
 * Przełącza kierunek sortowania (A-Z na Z-A i odwrotnie) oraz wywołuje sortowanie listy.
 */
function toggleSort() {
  sortDirectionAsc = !sortDirectionAsc;
  const sortButton = document.getElementById('sort-button');
  sortButton.innerText = sortDirectionAsc ? 'A-Z' : 'Z-A';
  sortCountries();
}

/**
 * Sortuje elementy <li> alfabetycznie, odcinając wcześniej flagi z początku tekstu.
 * Aktualizuje widok aktualnej strony po posortowaniu.
 */
function sortCountries() {
  const allCountries = Array.from(countryList.getElementsByTagName('li'));

  allCountries.sort((a, b) => {
    const nameA = a.textContent.substring(a.textContent.indexOf(' ') + 1).trim();
    const nameB = b.textContent.substring(b.textContent.indexOf(' ') + 1).trim();

    if (sortDirectionAsc) {
      return nameA.localeCompare(nameB, 'pl');
    } else {
      return nameB.localeCompare(nameA, 'pl');
    }
  });

  allCountries.forEach(li => countryList.appendChild(li));
  displayPage(currentPage);
}

/**
 * Pobiera wszystkie państwa, które nie zostały ukryte przez filtry.
 * * @returns {HTMLElement[]} Tablica widocznych elementów <li> z państwami
 */
function getVisibleCountries() {
  return Array.from(countryList.querySelectorAll('li:not(.hidden-by-filter)'));
}

/**
 * Tworzy i wstawia interfejs użytkownika dla filtrów (wyszukiwarka, dropdown kontynentów, sortowanie).
 * Automatycznie sortuje listę dostępnych kontynentów alfabetycznie.
 */
function createFiltersUI() {
  if (document.getElementById('filters-container')) return;

  // Główny kontener
  const container = document.createElement('div');
  container.id = 'filters-container';
  container.className = 'main-form';

  // Nagłówek
  const header = document.createElement('h1');
  header.className = 'f-comic f-big';
  header.innerText = 'Lista krajów';
  container.appendChild(header);

  // div na inputy
  const inputsWrapper = document.createElement('div');
  inputsWrapper.className = 'input-group';
  container.appendChild(inputsWrapper);

  // Pole wyszukiwania 
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = 'search-input';
  searchInput.placeholder = 'Wyszukaj kraj...';

  // Lista rozwijana 
  const selectFilter = document.createElement('select');
  selectFilter.id = 'continent-filter';

  // Opcje kontynentów
  const options = [
    { value: 'all', text: 'Wszystkie kontynenty' },
    { value: 'Europe', text: 'Europa' },
    { value: 'Asia', text: 'Azja' },
    { value: 'Africa', text: 'Afryka' },
    { value: 'Americas', text: 'Ameryki' },
    { value: 'Oceania', text: 'Oceania' },
    { value: 'Antarctic', text: 'Antarktyda' }
  ];

  const defaultOption = options.shift();
  options.sort((a, b) => a.text.localeCompare(b.text, 'pl'));
  options.unshift(defaultOption);

  options.forEach(optData => {
  const option = document.createElement('option');
  option.value = optData.value;
  option.innerText = optData.text;
  selectFilter.appendChild(option);
  });

  const sortButton = document.createElement('button');
  sortButton.id = 'sort-button';
  sortButton.innerText = 'A-Z';
  sortButton.title = 'Sortuj alfabetycznie';

  sortButton.addEventListener('mouseover', () => sortButton.style.filter = 'brightness(1.1)');
  sortButton.addEventListener('mouseout', () => sortButton.style.filter = 'none');

  // Wrzucamy elementy do kontenera
  container.appendChild(searchInput);
  container.appendChild(selectFilter);
  container.appendChild(sortButton);

  // Wstawiamy cały kontener tuż przed listą państw 
  countryList.parentNode.insertBefore(container, countryList);

  // Podpinamy Event Listenery 
  searchInput.addEventListener('input', applyFilters);
  selectFilter.addEventListener('change', applyFilters);
  sortButton.addEventListener('click', toggleSort);
}

/**
 * Filtruje listę krajów na podstawie wpisanego tekstu i wybranego kontynentu.
 * Ignoruje flagi na początku tekstu podczas wyszukiwania.
 * Resetuje paginację do strony 1 po zastosowaniu filtrów.
 */
function applyFilters() {
  const searchInput = document.getElementById('search-input');
  const continentFilter = document.getElementById('continent-filter');

  const searchTerm = searchInput.value.toLowerCase();
  const selectedContinent = continentFilter.value;

  const allCountries = Array.from(countryList.getElementsByTagName('li'));

  allCountries.forEach(li => {
    //  Zabezpieczanie wyszukiwania przed flagami-emoji na początku tekstu
    const name = li.textContent.toLowerCase();
    const matchesSearch = name.includes(searchTerm);

    const region = li.getAttribute('data-region') || '';
    const matchesContinent = selectedContinent === 'all' || region === selectedContinent;

    if (matchesSearch && matchesContinent) {
      li.classList.remove('hidden-by-filter');
    } else {
      li.classList.add('hidden-by-filter');
    }
  });

  currentPage = 1;

  const url = new URL(window.location.href);
  url.searchParams.set('page', 1);
  window.history.pushState({}, '', url);

  createPagesList();
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

  const urlParams = new URLSearchParams(window.location.search);
  let pageParam = urlParams.has('page') ? `&page=${urlParams.get('page')}` : '';
  
  const listElements = Array.from(list.getElementsByTagName('li'));

  listElements.forEach((li, index) => {
    const a = document.createElement('a');

    let countryCode = li.id.split('/')[1];
    let text = li.innerText;

    li.innerText = '';
    a.innerText = text;

    a.href = "?country=" + countryCode + pageParam;
    li.appendChild(a);
  })
};

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
  const visibleCountries = getVisibleCountries();
  let lastPage = Math.ceil(visibleCountries.length / countriesPerPage);
  if (lastPage === 0) lastPage = 1;

  if(currentPage + pageShift >= lastPage)
    currentPage = lastPage;
  else if(currentPage + pageShift <= firstPage)
    currentPage = firstPage;
  else
    currentPage += pageShift;

  let url = new URL(window.location.href);
  url.searchParams.set('page', currentPage);
  window.location.href = url.toString();
}


/**
 * Tworzy listę elementów paginacji zależnie od liczby stron.
 *
 * @see {@link createPage}
 */
function createPagesList() {
  const visibleCountries = getVisibleCountries();
  let pagesNumber = Math.ceil(visibleCountries.length / countriesPerPage);
  if (pagesNumber === 0) pagesNumber = 1;

  // Znajdujemy wszystkie stałe przyciski 
  const allItems = Array.from(pageList.children);
  const controlButtons = allItems.filter(li => !li.querySelector('a[href^="?page="]'));

  // Dzielimy je na te z lewej (<< i <) oraz z prawej (> i >>)
  const half = Math.ceil(controlButtons.length / 2);
  const startButtons = controlButtons.slice(0, half);
  const endButtons = controlButtons.slice(half);

  // Czyścimy listę
  pageList.innerHTML = '';

  // Wstawiamy przyciski startowe
  startButtons.forEach(btn => pageList.appendChild(btn));

  // Wstawiamy wygenerowane numery stron
  for (let p = 1; p <= pagesNumber; p++) {
    let page = createPage(p);
    if (page !== -1) pageList.appendChild(page);
  }

  // Wstawiamy przyciski końcowe
  endButtons.forEach(btn => pageList.appendChild(btn));
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
    const link = pageElement.querySelector('a');
    if (link) {
      if (parseInt(link.innerText) === page) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    }

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
  const allCountries = Array.from(countryList.getElementsByTagName('li'));
  const visibleCountries = getVisibleCountries();

  const startIndex = (page - 1) * countriesPerPage;
  const endIndex = startIndex + countriesPerPage;

  allCountries.forEach(country => {
    country.style.display = 'none';
  });

  visibleCountries.forEach((country, index) => {
    if (index >= startIndex && index < endIndex) {
      country.style.display = 'block';
    }
  });
}
