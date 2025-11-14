/**
 * Creates a search bar component with an input field and a search button.
 * The component allows the user to enter a query and submits it either by clicking the button or pressing the Enter key.
 * @param {function(string): void} onSearch - A callback function executed when the user submits a non-empty search query. The query string is passed as the argument.
 * @returns {HTMLDivElement} The container element for the search input component.
 */

export const SearchInput = (onSearch: (query: string) => void): HTMLDivElement => {
  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-input-container';

  const input = document.createElement('input');
  input.type = 'search';
  input.placeholder = 'Search profiles or posts...';
  input.classList.add('search-input');
  input.autocomplete = 'off';

  const searchButton = document.createElement('button');
  searchButton.textContent = '🔍 Search';
  searchButton.classList.add('search-button');

  searchButton.addEventListener('click', () => {
    const query = input.value.trim();
    if (query) {
      onSearch(query);
    }
  });

  input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const query = input.value.trim();
      if (query) {
        onSearch(query);
      }
    }
  });

  searchContainer.append(input, searchButton);

  return searchContainer;
}
  