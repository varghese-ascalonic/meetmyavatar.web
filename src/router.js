import { createRouter, createWebHashHistory } from 'vue-router';
import AuthenticateComponent from './components/AuthenticateComponent.vue';
import HelloWorld from './components/HelloWorld.vue';
import MessengerLayout from './components/MessengerLayout.vue';
import LoginSuccess from './components/LoginSuccess.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HelloWorld
    },
    {
        path: '/authenticate',
        name: 'Authenticate',
        component: AuthenticateComponent,
        meta: { requiresGuest: true } // Mark this route as guest-only
    },
    {
        path: '/messages',
        name: 'Messenger',
        component: MessengerLayout,
        meta: { requiresAuth: true } // Mark this route as protected
    },
    {
        path: '/login-success',
        name: 'LoginSuccess',
        component: LoginSuccess
    }
    // Add more routes here as needed
];

const router = createRouter({
    history: createWebHashHistory(), // Hash mode (uses # in the URL)
    routes
});

// Function to check if the auth token is valid and not expired
function checkTokenExpiration(token) {
    if (!token) return true; // Token is not present, treat as expired

    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = tokenPayload.exp * 1000; // Convert expiration to milliseconds
    const currentTime = Date.now();
    
    return expirationTime < currentTime; // True if token is expired
}

// Global navigation guard
router.beforeEach((to, from, next) => {
    const authToken = localStorage.getItem('authToken'); // Get the token from localStorage
    const isAuthenticated = !!authToken && !checkTokenExpiration(authToken); // Check if token exists and is not expired

    // If the user tries to access a guest route (like /authenticate) but is logged in, redirect to /messages
    if (to.matched.some(record => record.meta.requiresGuest) && isAuthenticated) {
        next({ path: '/messages' });
    } 
    // If the user tries to access an authenticated route (like /messages) without a valid token, redirect to /authenticate
    else if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
        localStorage.removeItem('authToken'); // Clear the token if it's invalid or expired
        next({ path: '/authenticate' });
    } 
    // Otherwise, allow the navigation
    else {
        next();
    }
});

export default router;
