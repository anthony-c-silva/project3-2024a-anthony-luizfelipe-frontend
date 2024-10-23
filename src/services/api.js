import axios from 'axios'

const api = axios.create({
    // baseURL: 'https://project3-2024a-anthony-luizfelipe-backend.onrender.com'
    baseURL: 'http://localhost:3333'
})

// Configuração global para incluir o token de autorização em todas as requisições
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
export default api