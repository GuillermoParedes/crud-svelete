import axios from 'axios'

const http = axios.create({
    // baseURL: "https://northwind.now.sh/api",
    baseURL: "http://localhost:3105/api",
    // baseURL: "http://192.168.88.111:3105/api",
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
  })

export default http
