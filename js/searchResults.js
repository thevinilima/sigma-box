import api from './api.js';

const IMG_BASE_URL = 'https://image.tmdb.org/t/p/original';

const listEl = document.querySelector('.list');

let result = [];
let loading = true;

document.body.onload = () => search();

const search = () => {
  listEl.innerHTML = null;
  const spinnerContainer = document.createElement('div');
  spinnerContainer.classList.add('spinner-container');
  const spinner = document.createElement('div');
  spinner.classList.add('spinner-border', 'm-2', 'mx-auto');
  spinner.setAttribute('role', 'status');
  spinnerContainer.appendChild(spinner);
  listEl.appendChild(spinnerContainer);

  const params = new URLSearchParams(location.search);
  api
    .get('/search/multi', {
      params: {
        query: params.get('query'),
        page: params.get('page'),
        language: 'pt-BR',
        include_adult: false,
      },
    })
    .then(res => {
      result = res.data.results;
      listResult();
    })
    .catch(() => {
      const messageDiv = document.createElement('div');
      messageDiv.innerText = 'Ocorreu um erro na pesquisa';
      listEl.innerHTML = null;
      listEl.appendChild(messageDiv);
    });
};

const listResult = () => {
  listEl.innerHTML = null;

  if (!result.length) {
    const messageDiv = document.createElement('div');
    const message = 'Nenhum resultado encontrado';
    messageDiv.innerText = message;
    messageDiv.classList.add('search-warning');
    listEl.appendChild(messageDiv);

    return;
  }

  result.forEach(result => {
    const card = document.createElement('div');
    card.classList.add('list-card');

    const posterDiv = document.createElement('div');
    posterDiv.classList.add('poster');
    const poster = document.createElement('img');
    poster.src = IMG_BASE_URL + (result.poster_path || result.profile_path);
    posterDiv.appendChild(poster);

    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('details');

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    const title = document.createElement('h4');
    title.innerText = result.title || result.name;
    titleDiv.appendChild(title);
    detailsDiv.appendChild(titleDiv);

    const descDiv = document.createElement('div');
    descDiv.classList.add('desc');
    descDiv.innerText = result.overview;
    detailsDiv.appendChild(descDiv);

    const chipsDiv = document.createElement('div');
    chipsDiv.classList.add('chips');
    detailsDiv.appendChild(chipsDiv);

    card.appendChild(posterDiv);
    card.appendChild(detailsDiv);

    listEl.appendChild(card);
  });
};
