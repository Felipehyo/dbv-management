import axios from 'axios';

const api = axios.create({
    baseURL: 'https://dbv-financeiro.herokuapp.com/pathfinders/'
})

export default api;