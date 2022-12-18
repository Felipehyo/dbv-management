import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/pathfinders/',
})

export default api;