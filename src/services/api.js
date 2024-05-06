import axios from 'axios';
import { checkLogin, loggedOut } from "../services/auth.service";

const axiosInstance = axios.create({
    baseURL: `http://54.218.129.223/api/v1/`,
});

let isRefreshing = false;
let refreshPromise = null;

async function getRefreshToken() {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await checkLogin(user.refresh);
    return response.data;
}

async function logout() {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await loggedOut(user.refresh);
    window.location.href = '/login';
}

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      const status = error.response ? error.response.status : null;
      if (status === 401) {
        const originalRequest = error.config;
        if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = getRefreshToken()
                .then(response => {
                    const user = JSON.parse(localStorage.getItem('user'));
                    user.access = response.data.access_token;
                    localStorage.setItem('user', JSON.stringify(user));
                    originalRequest.headers['Authorization'] = `Bearer ${response.data.access_token}`;
                    return axios(originalRequest);
                })
                .catch(error => {
                    console.error("Failed to refresh token:", error);
                    logout();
                })
                .finally(() => {
                    isRefreshing = false;
                });
        }
  
        // Wait for the token refresh to complete
        return refreshPromise;
      }
      
      return Promise.reject(error);
    }
  );

  export default axiosInstance;