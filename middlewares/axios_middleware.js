import axios from "axios";

const config = require('../config/config');
const tokenManager = require('../helpers/token_manager');

const TOKEN_URL = 'https://oauth.u-tec.com/token';
const API_URL = 'https://api.u-tec.com/action';

const axiosInstances = {
    token: axios.create({
        baseURL: TOKEN_URL,
        timeout: 5000,
		headers: { 
		  'Content-Type': 'application/x-www-form-urlencoded' 
		}
    }),
    api: axios.create({
        baseURL: API_URL,
        timeout: 5000,
		headers: { 
		  'Content-Type': 'application/json'
	  }
    })
};


const axiosMiddleware = (req, res, next) => {
    if ('scope' in req.query) { // if query has 'scope' we will assume it is a token query
        req.axios = axiosInstances.token; 
    } else {
        req.axios = axiosInstances.api;
    }

    next();
};

Object.keys(axiosInstances).forEach((service) => {
    axiosInstances[service].interceptors.request.use(
        (config) => {
            console.log(`[Axios Middleware] Request to ${service}: ${config.baseURL}${config.url}`);

			if (TRACE_API === true) {
				console.log(`Outgoing Request: ${request.method.toUpperCase()} ${request.url}`);
				console.log(`Headers:`, request.headers);
				console.log(`Post Data:`, request.data);
			}
            
			if (service === 'api') {
	            config.headers = {
                  ...config.headers, // Preserve existing headers
				  'Authorization': `Bearer ${tokenManager.getAccessToken()}`,
				}
            }
			
            return config;
        },
        (error) => Promise.reject(error)
    );

    axiosInstances[service].interceptors.response.use(
        (response) => {
            console.log(`[Axios Middleware] Response from ${service}: ${response.status}`);

			if (TRACE_API === true) {
			  console.log(`Response from: ${response.config.url}`);
			  console.log(`Status: ${response.status}`);
			  console.log(`Response Data:`, response.data);
			}

            return response;
        },
        (error) => {
            console.error(`[Axios Middleware] Error from ${service}:`, error.message);
            return Promise.reject(error);
        }
    );
});


// Express Middleware Function
const axiosMiddleware = (req, res, next) => {
    req.axios = axiosInstance; // Attach axios instance to the request
    next(); // Proceed to next middleware or route handler
};

module.exports = axiosMiddleware;

api.interceptors.response.use(
  (response) => response, // If the response is successful, return it.
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite loops

      try {
        const newAccessToken = await refreshToken();
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return api(originalRequest); // Retry the original request
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

