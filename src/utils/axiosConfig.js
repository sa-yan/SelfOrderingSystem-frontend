import axios from 'axios';

const instance = axios.create({
    baseURL: `${import.meta.env.VITE_REACT_APP_API_URL}`,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE',
    }
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers['X-ADMIN-API-KEY'] = token;
        }
        // For PUT and PATCH requests, ensure content type is application/json
        if (config.method === 'put' || config.method === 'patch') {
            config.headers['Content-Type'] = 'application/json';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
