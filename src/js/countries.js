/**
 * Zapełnia element listą elementów zawierających pozyskane informacje z *restcountries.com*
 * - Wysyła żądanie do *restcountries.com* o przefiltrowane dane wszystkich dostępnych krajów.
 * Wybrane pola są ustawione pod zmienną fields.
 * - Tworzy nowy element typu `childType`, dla każdego kraju i wypełnia go pozyskanymi danymi.
 *   * W zależności od `getFullName`, ustawia `innerText` elementu na flagę i kod lub flagę i pełną nazwę kraju (przetłumaczoną na język polski).
 *   * W zależności od `useIdAsValue`, ustawia `value` lub `id` elementu na kod kraju.
 * - Dodaje nowe elementy do danego nadrzędnego elementu `selectElement`.
 *
 * @param {HTMLElement} selectElement Nadrzędny element wypełniany nowo utworzonymi elementami
 * @param {string} childType Typ elementu potomnego (np. option)
 * @param {boolean} [getFullName=false] Jeśli `true` używana jest pełna nazwa kraju
 * @param {boolean} [useIdAsValue=false] Jeśli `true` używane jest `id` elementu zamiast `value`
 * @returns {Promise<void>} Zwraca wartość po przetworzeniu żądania
 */
async function populateWithCountries(selectElement, childType, getFullName = false, useIdAsValue = false) {
  let fields = 'cca3,flag,name,currencies,translations'

  return await fetch(countriesApiUrl + withThose + fields)
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
      let visibleName = name;
      if(getFullName)
        visibleName = country.translations.pol.common; //country.name.common;
      let flag = country.flag;

      let child = document.createElement(childType);
      if(useIdAsValue)
        child.id = child.id + ' /' + name;
      else
        child.value = name;
      child.innerText = flag + ' ' + visibleName;

      selectElement.appendChild(child);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

/**
 * Wysyła żądanie do *restcountries.com* o informacje, o walucie kraju, którego kod został podany w `countryCode`.
 *
 * Ustawia `value` podanych elementów `nameElement`, `symbolElement` i `codeElement`
 * na odpowiednio *nazwę waluty*, *symbol waluty* oraz *kod waluty*.
 *
 * @param {HTMLElement} nameElement Element do którego zostanie przypisana nazwa waluty pod `value`
 * @param {HTMLElement} symbolElement Element do którego zostanie przypisany symbol waluty pod `value`
 * @param {HTMLElement} codeElement Element do którego zostanie przypisany kod waluty pod `value`
 * @param {string} countryCode Trzyliterowy kod kraju wg. standardu ISO 3166-1
 */
function insertCountryCurrency(nameElement, symbolElement, codeElement, countryCode) {
  let fields = 'currencies'

  fetch(countryByCodeApiUrl + '/' + countryCode + withThose + fields)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(responseData => {
    if(responseData === undefined) {
      console.warn('Invalid or missing country code!');
    } else if(Object.keys(responseData.currencies).length === 0) {
      console.info('No currencies found for this country');
    } else {
      const country = responseData;
      let currencyCode   = Object.keys(country.currencies)[0];
      let currencyName = country.currencies[currencyCode].name;
      let currencySymbol = country.currencies[currencyCode].symbol;

      nameElement.value   = currencyName;
      symbolElement.value = currencySymbol;
      codeElement.value   = currencyCode;
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}


/**
 * Wysyła żądanie do *restcountries.com* o informacje, o walucie kraju, którego kod został podany w `countryCode`.
 *
 * Zwraca odpowiedź z polami ustalonymi pod zmienną `fields`.
 *
 * @param {string} countryCode Trzyliterowy kod kraju wg. standardu ISO 3166-1
 * @returns {Promise<Response>} Zwraca wartość po przetworzeniu żądania
 */
async function getCountryDetails(countryCode) {
  let fields = 'capital,borders,area,maps,population,car,timezones,continents,currencies,languages,flags,translations';

    return await fetch(countryByCodeApiUrl + '/' + countryCode + withThose + fields)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(responseData => {
      if(responseData === undefined) {
        console.warn('Invalid or missing country code!');
      } else {
        return responseData;
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
