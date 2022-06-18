import api from './api.js';

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const listDiv = document.querySelector('.ac-items');

let results = [];

let loading = false;

const search = () => {
  if (loading || !results.length) return;
  location.href = `pesquisa.html?query=${searchInput.value}&page=1`;
};

const autoComplete = () => {
  listDiv.innerHTML = null;

  if (!results.length || results[0].error) {
    const messageDiv = document.createElement('div');
    const message =
      (results[0] && results[0].error) || 'Nenhum resultado encontrado';
    messageDiv.innerText = message;
    messageDiv.classList.add('search-warning');
    listDiv.appendChild(messageDiv);

    return;
  }

  results.forEach(result => {
    const item = document.createElement('div');
    item.innerText = result.title || result.name;
    listDiv.appendChild(item);
  });
};

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  search();
});

searchBtn.addEventListener('click', search);

let debounce = null;
searchInput.addEventListener('input', () => {
  if (debounce) clearTimeout(debounce);

  const query = searchInput.value;
  if (!query) {
    listDiv.innerHTML = null;
    loading = false;
    return;
  }

  if (!loading) {
    listDiv.innerHTML = null;
    const spinnerContainer = document.createElement('div');
    spinnerContainer.classList.add('spinner-container');
    const spinner = document.createElement('div');
    spinner.classList.add(
      'spinner-border',
      'spinner-border-sm',
      'm-2',
      'mx-auto'
    );
    spinner.setAttribute('role', 'status');
    spinnerContainer.appendChild(spinner);
    listDiv.appendChild(spinnerContainer);
    loading = true;
  }

  debounce = setTimeout(() => {
    api
      .get('/search/multi', {
        params: {
          query,
          language: 'pt-BR',
          include_adult: false,
        },
      })
      .then(res => {
        results = res.data.results;
      })
      .catch(() => {
        results = [{ error: 'Ocorreu um erro ao buscar os filmes' }];
      })
      .finally(() => {
        autoComplete();
        loading = false;
      });
  }, 1000);
});
