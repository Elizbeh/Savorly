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

// Redirect to login with correct subpath on GitHub Pages
const loginRedirectUrl = isProd
  ? `${import.meta.env.VITE_CLIENT_URL}/savorly-frontend/#/login`
  : `${import.meta.env.VITE_CLIENT_URL}/#/login`;

// Guard the interceptor to only run in the browser
if (typeof window !== "undefined") {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        const publicHashes = ["", "#/", "#/login", "#/register", "#/verify-email"];
        const currentHash = window.location.hash;

        if (!publicHashes.includes(currentHash)) {
          window.location.href = loginRedirectUrl;
        }
      } else {
        console.error("API Error:", error.response?.data || error.message);
      }
      return Promise.reject(error);
    }
  );
}

export default api;
