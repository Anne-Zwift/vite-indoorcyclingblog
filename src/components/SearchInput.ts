/**
 * Creates a search bar component with an input field and a search button.
 * The component allows the user to enter a query and submits it either by clicking the button or pressing the Enter key.
 * @param {function(string): void} onSearch - A callback function executed when the user submits a non-empty search query. The query string is passed as the argument.
 * @returns {HTMLDivElement} The container element for the search input component.
 */

export const SearchInput = (onSearch: (query: string) => void): HTMLDivElement => {
  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-input-container space-y-1';

  const input = document.createElement('input');
  input.type = 'search';
  input.placeholder = 'Search profiles or posts...';
  input.classList.add('search-input');
  input.className = 'search-input-container w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all outline-none'
  input.autocomplete = 'off';

  const searchButton = document.createElement('button');
  searchButton.textContent = '🔍 Search';
  searchButton.classList.add('search-button');
  searchButton.className = 'w-full bg-sky-600 text-white py-3 rounded-lg font-bold hover:bg-sky-700 active:scale-[0.98] transition-all shadow-md mt-4';

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
  