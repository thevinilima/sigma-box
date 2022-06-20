import api, { IMG_BASE_URL } from './api.js';

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search');
const listDiv = document.querySelector('.ac-items');

let results = [];

let loading = false;

const autoComplete = () => {
  listDiv.innerHTML = null;

  if (!results.length) {
    const messageDiv = document.createElement('div');
    const message = 'Nenhum resultado encontrado';
    messageDiv.innerText = message;
    messageDiv.classList.add('search-warning');
    listDiv.appendChild(messageDiv);

    return;
  }

  results.forEach(result => {
    const item = document.createElement('div');
    item.classList.add('ac-item');

    let thumbnail = null;
    if (result.poster_path) {
      thumbnail = document.createElement('img');
      thumbnail.classList.add('thumbnail');
      thumbnail.src = IMG_BASE_URL + result.poster_path;
    } else {
      thumbnail = document.createElement('div');
      thumbnail.classList.add('thumbnail', 'icon');
      const icon = document.createElement('i');
      icon.classList.add('fa-solid', 'fa-question');
      thumbnail.appendChild(icon);
    }
    item.appendChild(thumbnail);

    if (result.media_type !== 'person')
      item.addEventListener('click', () => {
        location.href = `detalhes.html?type=${result.media_type}&id=${result.id}`;
      });

    const textSpan = document.createElement('span');
    textSpan.innerText = result.title || result.name;
    item.appendChild(textSpan);

    listDiv.appendChild(item);
  });
};

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  if (searchInput.value)
    location.href = `pesquisa.html?query=${searchInput.value}&page=1`;
});

let debounce = null;
searchInput.addEventListener('input', () => {
  if (debounce) clearTimeout(debounce);

  const query = searchInput.value;
  if (!query) {
    listDiv.innerHTML = null;
    loading = false;
    if (debounce) clearTimeout(debounce);
    return;
  }

  if (!loading) {
    listDiv.innerHTML = null;
    listDiv.classList.remove('hidden');
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
        autoComplete();
      })
      .catch(() => {
        const messageDiv = document.createElement('div');
        messageDiv.innerText = 'Ocorreu um erro na pesquisa';
        listEl.innerHTML = null;
        listEl.appendChild(messageDiv);
      })
      .finally(() => {
        loading = false;
      });
  }, 1000);
});

searchInput.addEventListener('focus', () => {
  listDiv.classList.remove('hidden');
});

document.addEventListener('click', () => {
  if (searchInput.value && searchInput !== document.activeElement)
    listDiv.classList.add('hidden');
});
