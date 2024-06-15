import axios from 'axios';

const api = axios.create({
    // baseURL: 'https://dbv-financeiro.herokuapp.com/pathfinders/'
    baseURL: 'https://portaldbv.com/pathfinders/'
    // baseURL: 'http://localhost:8080/pathfinders/'
    // baseURL: 'http://192.168.0.113:8080/pathfinders/'
})

export default api;