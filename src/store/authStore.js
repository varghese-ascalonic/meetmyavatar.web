import axios from 'axios';
import apiConfig from '../config/api';

// src/store/modules/authStore.js
export default {
    namespaced: true,
    state: () => ({
        user: {
            email: '', // You can add more default properties if needed
        },
    }),
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setUserExists(state, exists) {
            state.userExists = exists;
        },
    },
    actions: {
        async checkUserExists({ commit }, email) {
            try {
                const response = await axios.get(`${apiConfig.BASE_URL}/Auth/user-exists`, {
                    params: { email },
                });
                commit('setUserExists', response.data);
                if (response.data) {
                    commit('setUser', { email });
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    commit('setUserExists', false);
                } else {
                    console.error('Error checking if user exists:', error);
                }
            }
        },
        async createAccount({ commit }, { email, password }) {
            // Handle account creation logic here
            commit('setUser', { email, password });
            // Additional logic like storing tokens can be implemented here
        },
        async login({ commit }, { email, password }) {
            // Handle login logic here (e.g., verify email/password)
            commit('setUser', { email, password });
            // Additional logic like storing tokens can be implemented here
        },
    },
    getters: {
        user: (state) => state.user,
        userExists: (state) => state.userExists,
    },
};
