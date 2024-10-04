// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import AuthenticateComponent from './components/AuthenticateComponent.vue';
import HelloWorld from './components/HelloWorld.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HelloWorld
    },
    {
        path: '/authenticate',
        name: 'Authenticate',
        component: AuthenticateComponent
    },
    // Add more routes here as needed
];

const router = createRouter({
    history: createWebHistory(), // Use the browser's history mode (no hash in the URL)
    routes
});

export default router;
