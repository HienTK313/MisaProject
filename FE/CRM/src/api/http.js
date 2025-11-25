import axios from 'axios'

const API_BASE_URL = 'https://localhost:7153/api' // config nằm ngay api layer

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

http.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err?.response?.data || err),
)

export default http
export { API_BASE_URL }
