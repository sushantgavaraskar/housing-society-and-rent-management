import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Match your backend
  withCredentials: true, // For cookie-based auth
});

// Optional: Add interceptors for token auth
// API.interceptors.response.use(
//   res => res,
//   err => {
//     if (err.response?.status === 401) {
//       window.location.href = "/login";
//     }
//     return Promise.reject(err);
//   }
// );

export default API;
