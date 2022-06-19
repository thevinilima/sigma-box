const BASE_URL = 'https://api.themoviedb.org/3/';
const API_KEY =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YTA0MTBhMjhmNmM4Y2FjYjg0ZWFkNzllYjdiZGY0YiIsInN1YiI6IjYyYWNhYTE0NWFkNzZiMDUwNmI1OGZiMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tHwIJO8d0YUvOvWoJAqC40C8rTEzMJ0jSFIEndtsGSk';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
});

export const IMG_BASE_URL = 'https://image.tmdb.org/t/p/original';

export default api;
