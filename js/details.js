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
  const spinner = document.getElementById('details-spinner');
  spinner.classList.remove('hidden');
  api
    .get(`/${params.get('type')}/${params.get('id')}`, {
      params: {
        language: 'pt-BR',
      },
    })
    .then(({ data }) => {
      details = data;
      showDetails();
    })
    .finally(() => spinner.classList.add('hidden'));
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
  descDiv.innerText = details.overview || '';

  const ratingSpan = document.querySelector('#rating span');
  ratingSpan.innerText = details.vote_average.toFixed(1);

  const tmdbLink = document.getElementById('tmdb-link');
  tmdbLink.href = `https://www.themoviedb.org/${params.get(
    'type'
  )}/${params.get('id')}`;
};

const fetchCredits = () => {
  const spinner = document.getElementById('cast-spinner');
  spinner.classList.remove('hidden');
  api
    .get(`/${params.get('type')}/${params.get('id')}/credits`, {
      params: {
        language: 'pt-BR',
      },
    })
    .then(({ data }) => {
      credits = data;
      showCredits();
    })
    .finally(() => spinner.classList.add('hidden'));
};

const showCredits = () => {
  const actorsContainers = document.querySelectorAll('#cast .actor');
  const actorsImgs = document.querySelectorAll('#cast .actor img');
  const actorsNames = document.querySelectorAll('#cast .actor .actor-name');
  const actorsRoles = document.querySelectorAll('#cast .actor .actor-role');
  const cast = credits.cast;
  cast.forEach((actor, index) => {
    actorsContainers[index].classList.remove('hidden');
    actorsImgs[index].src = IMG_BASE_URL + actor.profile_path;
    actorsNames[index].innerText = actor.name || actor.original_name;
    actorsRoles[index].innerText = actor.character;
  });
};
