import axios from 'axios';

const api = axios.create({
    baseURL: 'https://portaldbv.com/pathfinders/v1/'
    // baseURL: 'http://localhost:8080/pathfinders/'
    // baseURL: 'http://localhost:8080/pathfinders/v1/'
    // baseURL: 'http://192.168.1.3:8080/pathfinders/v1/'
})

export default api;
