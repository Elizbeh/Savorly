import axios from "axios";

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

let httpsAgent;

if (isDev) {
  const httpsModule = await import("https");
  httpsAgent = new httpsModule.Agent({
    rejectUnauthorized: false,
  });
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  ...(isDev && httpsAgent ? { httpsAgent } : {}),
});

const loginRedirectUrl = isProd
  ? `${import.meta.env.VITE_CLIENT_URL}/login`
  : `${import.meta.env.VITE_CLIENT_URL}/login`;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on public pages like landing, login, register
      const publicPaths = ["/", "/login", "/register", "/verify-email"];
      const currentPath = window.location.pathname;

      if (!publicPaths.includes(currentPath)) {
        window.location.href = loginRedirectUrl;
      }
    } else {
      console.error("API Error:", error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);


export default api;
