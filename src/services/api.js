import axios from 'axios';

const api = axios.create({
    // baseURL: 'https://portaldbv.com/pathfinders/'
    // baseURL: 'http://localhost:8080/pathfinders/'
    baseURL: 'http://18.231.17.148:8080/pathfinders/'
})

export default api;
