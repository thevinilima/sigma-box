import api, { IMG_BASE_URL } from './api.js';

document.body.onload = () => fetchAllData();

const fetchAllData = () => {
  fetchDetails();
  fetchCredits();
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

const params = new URLSearchParams(location.search);
let details = {};
let credits = {};

const fetchDetails = () => {
  api
    .get(`/${params.get('type')}/${params.get('id')}`, {
      params: {
        language: 'pt-BR',
      },
    })
    .then(({ data }) => {
      details = data;
      showDetails();
    });
};

const showDetails = () => {
  const chipsContainer = document.getElementById('chips');
  details.genres.forEach(genre => {
    const chip = document.createElement('div');
    chip.classList.add('chip');
    chip.innerText = genre.name;
    chipsContainer.appendChild(chip);
  });

  const typeChip = document.getElementById('type-chip');
  typeChip.firstElementChild.classList.add(types[params.get('type')].icon);
  typeChip.lastElementChild.innerText = types[params.get('type')].label;

  const posterImg = document.getElementById('poster');
  posterImg.src = IMG_BASE_URL + details.poster_path;

  const title = document.getElementById('title');
  title.innerText =
    details.title ||
    details.original_title ||
    details.name ||
    details.original_name;

  const descDiv = document.getElementById('desc');
  descDiv.innerText = details.overview;

  const ratingSpan = document.querySelector('#rating span');
  ratingSpan.innerText = details.vote_average.toFixed(1);

  const tmdbLink = document.getElementById('tmdb-link');
  tmdbLink.href = `https://www.themoviedb.org/${params.get(
    'type'
  )}/${params.get('id')}`;
};

const fetchCredits = () => {
  api
    .get(`/${params.get('type')}/${params.get('id')}/credits`, {
      params: {
        language: 'pt-BR',
      },
    })
    .then(({ data }) => {
      credits = data;
      showCredits();
    });
};

const showCredits = () => {
  const actorsImgs = document.querySelectorAll('#cast .actor img');
  const actorsNames = document.querySelectorAll('#cast .actor .actor-name');
  const actorsRoles = document.querySelectorAll('#cast .actor .actor-role');
  const cast = credits.cast;
  actorsImgs.forEach((actorImg, index) => {
    actorImg.src = IMG_BASE_URL + cast[index].profile_path;
    actorsNames[index].innerText =
      cast[index].name || cast[index].original_name;
    actorsRoles[index].innerText = cast[index].character;
  });
};
