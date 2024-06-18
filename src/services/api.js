import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000'
    // baseURL: 'https://project3-2024a-anthony-luizfelipe-backend-mzvs-g87tdrkg2.vercel.app'
})

export default api