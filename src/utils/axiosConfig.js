import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_API_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
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
