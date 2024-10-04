import axios from 'axios';
import apiConfig from '../config/api';

// src/store/modules/authStore.js
export default {
    namespaced: true,
    state: () => ({
        user: {
            email: '',
        },
        validationErrors: {} // New state to track form validation errors
    }),
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setUserExists(state, exists) {
            state.userExists = exists;
        },
        setValidationErrors(state, errors) {
            state.validationErrors = errors;
        },
        clearValidationErrors(state) {
            state.validationErrors = {};
        }
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
            try {
                commit('clearValidationErrors');
                await axios.post(`${apiConfig.BASE_URL}/Auth/create-user`, {
                    email,
                    password,
                    authType: 'PASSWORD'
                });
                commit('setUser', { email });
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    commit('setValidationErrors', error.response.data.errors);
                } else {
                    console.error('Error creating account:', error);
                }
            }
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
        validationErrors: (state) => state.validationErrors,
    },
};
