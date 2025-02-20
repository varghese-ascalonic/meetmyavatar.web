import axios from 'axios';
import router from '../router'; // Import the router for handling redirects

// API configuration
const API_CONFIG = {
    LOCAL: "https://localhost:32771",
    REMOTE: "https://meetmyavatar-dya3d4avdpbbf3ak.westeurope-01.azurewebsites.net",
};

// Set BASE_URL depending on the environment
const BASE_URL = process.env.NODE_ENV === 'production' ? API_CONFIG.REMOTE : API_CONFIG.LOCAL;

// Create an Axios instance
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add an Axios response interceptor to handle 401 errors
apiClient.interceptors.response.use(
    response => response, // If the response is successful, just return it
    error => {
        if (error.response && error.response.status === 401) {
            // If a 401 Unauthorized error is encountered, handle token expiration
            localStorage.removeItem('authToken'); // Remove the invalid token from localStorage
            router.push('/authenticate'); // Redirect to the /authenticate page
        }
        return Promise.reject(error); // Return the error so it can be handled elsewhere
    }
);

// Export the Axios instance
export default apiClient;
