import api from './api.js';

api.get('/trending/all/day').then(res => console.log(res.data));
