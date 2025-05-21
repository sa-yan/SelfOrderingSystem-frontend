import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 30000,
    headers: {
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*'
    }
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers['X-ADMIN-API-KEY'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
