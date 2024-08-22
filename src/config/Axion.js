import axios from 'axios';

// Cria uma instância do Axios com configurações padrão
const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Altere para o URL do seu backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptador para adicionar o token em cada requisição
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptador para tratar erros de resposta
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401) {
            // Redireciona para a página de login se o token for inválido
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
