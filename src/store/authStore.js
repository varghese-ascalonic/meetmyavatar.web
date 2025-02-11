import apiClient from '../axios/api';

export default {
    namespaced: true,
    state: () => ({
        user: {
            id: null,
            email: '',
            profilePictureUrl: null,
            authToken: '',
            userAccessMap: {}
        },
        validationErrors: {}, // State to track form validation errors
        userExists: false, // State to track if user exists
    }),
    mutations: {
        setUser(state, user) {
            state.user = user;
        },
        setUserExists(state, exists) {
            state.userExists = exists;
        },
        setAuthToken(state, token) {
            state.user.authToken = token; // Store the JWT token
        },
        setUserAccessMap(state, accessMap) {
            state.user.userAccessMap = accessMap; // Store user access map (avatars and permissions)
        },
        setValidationErrors(state, errors) {
            state.validationErrors = errors;
        },
        clearValidationErrors(state) {
            state.validationErrors = {};
        },
        clearUser(state) {
            state.user = {
                id: null,
                email: '',
                authToken: '',
                userAccessMap: {}
            };
        },
    },
    actions: {
        async checkUserExists({ commit }, email) {
            try {
                const response = await apiClient.get(`/Auth/user-exists`, {
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
        async fetchUserInfo({ commit }) {
            try {
                const token = localStorage.getItem('authToken');

                if (!token) {
                    throw new Error('No token found');
                }

                const response = await apiClient.post(`/Auth/user-info`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}` // Set the Authorization header with the Bearer token
                    }
                });

                const { id, email, userAccessMap } = response.data;

                commit('setUser', { id, email });
                commit('setUserAccessMap', userAccessMap);

            } catch (error) {
                console.error('Error fetching user info:', error);
                throw error;
            }
        },
        async createAccount({ commit }, { email, password, router }) {
            try {
                commit('clearValidationErrors');
                const response = await apiClient.post(`/Auth/create-user`, {
                    email,
                    password,
                    authType: 'PASSWORD'
                });
                // Store user details and auth token
                const { id, email: userEmail, authToken, userAccessMap } = response.data;

                commit('setUser', { id, email: userEmail });
                commit('setAuthToken', authToken); // Store JWT token
                commit('setUserAccessMap', userAccessMap); // Store access map with avatar permissions

                localStorage.setItem('authToken', authToken);

                router.push('/messages');
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    commit('setValidationErrors', error.response.data.errors);
                } else {
                    console.error('Error creating account:', error);
                }
            }
        },
        async login({ commit }, { email, password, router }) {
            try {
                commit('clearValidationErrors');
                const response = await apiClient.post(`/Auth/login`, {
                    email,
                    password
                });

                // Store user details and auth token
                const { id, email: userEmail, authToken, userAccessMap } = response.data;

                commit('setUser', { id, email: userEmail });
                commit('setAuthToken', authToken); // Store JWT token
                commit('setUserAccessMap', userAccessMap); // Store access map with avatar permissions

                localStorage.setItem('authToken', authToken);

                router.push('/messages');

            } catch (error) {
                if (error.response && error.response.status === 400) {
                    commit('setValidationErrors', error.response.data.errors);
                } else {
                    console.error('Error during login:', error);
                }
            }
        },
        async getGoogleLoginUrl() {
            try {
                const response = await apiClient.get('/Auth/google-login-url'); 
                return response.data.url; 
            } catch (error) {
                console.error('Error fetching Google login URL:', error);
                throw error;
            }
        },
        async handleGoogleCallback({ commit }, { code, router }) {
            console.log(code);
            try {
                const response = await apiClient.post(`/Auth/google-token-exchange`, { code : code }, {
                    headers: {
                        "Content-Type": "application/json", // Ensure the content type is JSON
                    },
                });

                const { authToken, id, email, userAccessMap } = response.data;

                commit('setUser', { id, email });
                commit('setAuthToken', authToken);
                commit('setUserAccessMap', userAccessMap);

                localStorage.setItem('authToken', authToken);

                // Redirect to dashboard or messages
                router.push('/messages');
            } catch (error) {
                console.error('Error handling Google callback:', error);
            }
        },
        logout({ commit }) {
            // Clear user data and token on logout
            commit('clearUser');
            localStorage.removeItem('authToken'); // Optionally clear token from localStorage
        }
    },
    getters: {
        user: (state) => state.user,
        userExists: (state) => state.userExists,
        validationErrors: (state) => state.validationErrors,
        authToken: (state) => state.user.authToken,
        userAccessMap: (state) => state.user.userAccessMap,
    },
};
