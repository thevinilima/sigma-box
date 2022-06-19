import api, { IMG_BASE_URL } from './api.js';

document.body.onload = () => fetchAllData();

const fetchAllData = () => {
  fetchTrending();
  fetchPlaying();
};

const types = {
  tv: {
    label: 'Série',
    icon: 'fa-tv',
  },
  movie: {
    label: 'Filme',
    icon: 'fa-film',
  },
};

let trending = {};
let playing = {};
let ranking = {};

const fetchTrending = () => {
  const spinner = document.querySelector('#trending .spinner-container');
  spinner.classList.remove('hidden');
  api
    .get('/trending/all/week', {
      params: {
        language: 'pt-BR',
      },
    })
    .then(({ data }) => {
      trending = data;
      listTrending();
    })
    .finally(() => spinner.classList.add('hidden'));
};

const listTrending = () => {
  const cards = document.querySelectorAll('#trending .movie-poster');
  const posters = document.querySelectorAll('#trending .movie-poster img');
  const titles = document.querySelectorAll('#trending .movie-poster .title');
  const typeChips = document.querySelectorAll('#trending .movie-poster .type');
  const ratingChips = document.querySelectorAll(
    '#trending .movie-poster .rating span'
  );

  cards.forEach((card, index) => {
    const item = trending.results[index];
    posters[index].src = IMG_BASE_URL + item.poster_path;
    titles[index].innerText =
      item.title || item.original_title || item.name || item.original_name;
    typeChips[index].firstElementChild.classList.add(
      types[item.media_type].icon
    );
    typeChips[index].lastElementChild.innerText = types[item.media_type].label;
    ratingChips[index].innerText = item.vote_average.toFixed(1);
    card.addEventListener('click', () => {
      location.href = `detalhes.html?type=${item.media_type}&id=${item.id}`;
    });
  });
};

const fetchPlaying = () => {
  const spinner = document.querySelector('#playing .spinner-container');
  spinner.classList.remove('hidden');
  api
    .get('/movie/now_playing', {
      params: {
        language: 'pt-BR',
        region: 'BR',
      },
    })
    .then(({ data }) => {
      playing = data;
      listPlaying();
    })
    .finally(() => spinner.classList.add('hidden'));
};

const listPlaying = () => {
  const cards = document.querySelectorAll('#playing .movie-poster');
  const posters = document.querySelectorAll('#playing .movie-poster img');
  const titles = document.querySelectorAll('#playing .movie-poster .title');
  const ratingChips = document.querySelectorAll(
    '#playing .movie-poster .rating span'
  );

  cards.forEach((card, index) => {
    const item = playing.results[index];
    posters[index].src = IMG_BASE_URL + item.poster_path;
    titles[index].innerText =
      item.title || item.original_title || item.name || item.original_name;
    ratingChips[index].innerText = item.vote_average.toFixed(1);
    card.addEventListener('click', () => {
      location.href = `detalhes.html?type=movie&id=${item.id}`;
    });
  });
};
