import api, { IMG_BASE_URL } from './api.js';

document.body.onload = () => fetchAllData();

const fetchAllData = () => {
  fetchTrending();
};

const types = {
  tv: 'Série',
  movie: 'Filme',
};

let trending = {};
let releases = {};
let ranking = {};

const fetchTrending = () => {
  api
    .get('/trending/all/week', {
      params: {
        language: 'pt-BR',
      },
    })
    .then(({ data }) => {
      trending = data;
      listTrending();
    });
};

const listTrending = () => {
  const posters = document.querySelectorAll('#trending .movie-poster img');
  const titles = document.querySelectorAll('#trending .movie-poster .title');
  const typeChips = document.querySelectorAll('#trending .movie-poster .type');
  const ratingChips = document.querySelectorAll(
    '#trending .movie-poster .rating span'
  );
  const linkChips = document.querySelectorAll('#trending .movie-poster .link');

  posters.forEach((poster, index) => {
    const item = trending.results[index];
    poster.src = IMG_BASE_URL + item.poster_path;
    titles[index].innerText =
      item.title || item.original_title || item.name || item.original_name;
    typeChips[index].innerText = types[item.media_type];
    ratingChips[index].innerText = item.vote_average.toFixed(1);
    linkChips[
      index
    ].href = `https://www.themoviedb.org/${item.media_type}/${item.id}`;
  });
};
