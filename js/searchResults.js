import api, { IMG_BASE_URL } from './api.js';

const listEl = document.querySelector('.list');
const searchInput = document.getElementById('search');
const totalResultsSpan = document.getElementById('total-results');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');

let results = [];
let pagination = {
  page: 1,
  totalPages: null,
};

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
  searchInput.value = params.get('query');
  pagination.page = params.get('page') || 1;
  api
    .get('/search/multi', {
      params: {
        query: params.get('query'),
        page: pagination.page,
        language: 'pt-BR',
        include_adult: false,
      },
    })
    .then(({ data }) => {
      results = data.results;
      totalResultsSpan.innerText = `${data.total_results.toLocaleString()} no total`;
      pagination.page = data.page;
      pagination.totalPages = data.total_pages;
    })
    .catch(() => {
      const messageDiv = document.createElement('div');
      messageDiv.innerText = 'Ocorreu um erro na pesquisa';
      listEl.innerHTML = null;
      listEl.appendChild(messageDiv);
    })
    .finally(() => {
      listResult();
      handlePagination();
    });
};

const listResult = () => {
  listEl.innerHTML = null;

  if (!results.length) {
    const messageDiv = document.createElement('div');
    const message = 'Nenhum resultado encontrado';
    messageDiv.innerText = message;
    messageDiv.classList.add('search-warning');
    listEl.appendChild(messageDiv);

    return;
  }

  results.forEach(result => {
    const card = document.createElement('div');
    card.classList.add('list-card');

    const posterDiv = document.createElement('div');
    posterDiv.classList.add('poster');
    let poster = null;
    if (result.poster_path || result.profile_path) {
      poster = document.createElement('img');
      poster.src = IMG_BASE_URL + (result.poster_path || result.profile_path);
    } else {
      poster = document.createElement('i');
      poster.classList.add('fa-solid', 'fa-question', 'fa-3x');
    }
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
    descDiv.innerText = result.overview || '';
    detailsDiv.appendChild(descDiv);

    const chipsDiv = document.createElement('div');
    chipsDiv.classList.add('chips');
    detailsDiv.appendChild(chipsDiv);

    card.appendChild(posterDiv);
    card.appendChild(detailsDiv);
    card.addEventListener('click', () => {
      location.href = `detalhes.html?type=${result.media_type}&id=${result.id}`;
    });

    listEl.appendChild(card);
  });
};

const handlePagination = () => {
  const pageCountSpan = document.getElementById('page-count');
  pageCountSpan.innerText = `${pagination.page} / ${pagination.totalPages}`;
  if (pagination.page === 1) prevPageBtn.classList.add('disabled');
  else prevPageBtn.classList.remove('disabled');
  if (pagination.page === pagination.totalPages)
    nextPageBtn.classList.add('disabled');
  else nextPageBtn.classList.remove('disabled');
};

const prevPage = () => {
  if (pagination.page <= 1 || prevPageBtn.classList.contains('disabled'))
    return;

  const params = new URLSearchParams(location.search);
  pagination.page--;
  params.set('page', pagination.page);

  const newUrl = `${location.protocol}//${location.host}${location.pathname}?${params}`;
  history.pushState({ path: newUrl }, null, newUrl);

  handlePagination();
  search();
};

const nextPage = () => {
  if (
    pagination.page >= pagination.totalPages ||
    nextPageBtn.classList.contains('disabled')
  )
    return;

  const params = new URLSearchParams(location.search);
  pagination.page++;
  params.set('page', pagination.page);

  const newUrl = `${location.protocol}//${location.host}${location.pathname}?${params}`;
  history.pushState({ path: newUrl }, null, newUrl);

  handlePagination();
  search();
};

prevPageBtn.addEventListener('click', prevPage);
nextPageBtn.addEventListener('click', nextPage);
