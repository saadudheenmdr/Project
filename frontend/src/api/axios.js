import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// --- REQUEST INTERCEPTOR (Outgoing Requests) ---
API.interceptors.request.use(
  (req) => {
    // 1. Identify public endpoints that should NEVER send an Authorization header
    const isPublicAuthRoute = 
      req.url?.includes("login") || 
      req.url?.includes("register") || 
      req.url?.includes("token");

    // 2. Only attach the token if it is NOT a public authentication route
    if (!isPublicAuthRoute) {
      const token = localStorage.getItem("token") || localStorage.getItem("access"); 
      if (token && req.headers) {
        req.headers.Authorization = `Bearer ${token}`; 
      }
    }

    // 3. Enforce trailing slash for Django URL path mapping compatibility
    if (req.url) {
      const [path, query] = req.url.split("?");
      if (!path.endsWith("/")) {
        req.url = query ? `${path}/?${query}` : `${path}/`;
      }
    }

    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- RESPONSE INTERCEPTOR (Incoming Responses) ---
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const originalUrl = error.config?.url || "";
      
      // Do not trigger a global logout/redirect if the 401 happened on login or register
      const isAuthRequest = 
        originalUrl.includes("login") || 
        originalUrl.includes("register") || 
        originalUrl.includes("token");

      if (!isAuthRequest) {
        console.warn("401 Intercepted: Clearing invalid session token.");
        
        localStorage.removeItem("token");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        
        if (window.location.pathname !== "/login") {
          window.location.href = "/login"; 
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;