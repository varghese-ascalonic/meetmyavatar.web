// src/router/index.js

import { createRouter, createWebHashHistory } from 'vue-router';
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
    history: createWebHashHistory(), // Switch to hash mode (uses # in the URL)
    routes
});

export default router;
