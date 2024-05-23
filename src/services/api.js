import axios from 'axios';

const api = axios.create({
    baseURL: 'https://dbv-financeiro.herokuapp.com/pathfinders/'
    // baseURL: 'http://localhost:8080/pathfinders/'
    // baseURL: 'http://192.168.0.123:8080/pathfinders/'
})

export default api;