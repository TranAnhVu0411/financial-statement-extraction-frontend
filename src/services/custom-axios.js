import axios from 'axios';

export const db_axios_instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3501/api',
});

db_axios_instance.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers['x-access-token'] = JSON.parse(localStorage.getItem("profile")).token;
  }
  return req;
});

export const ocr_axios_instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3502/api',
});