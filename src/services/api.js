import axios from 'axios'

const api = axios.create({
    baseURL: 'https://project3-2024a-anthony-luizfelipe-backend.onrender.com'
})

export default api