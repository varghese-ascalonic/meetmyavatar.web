import apiClient from '../axios/api';

export default {
    namespaced: true,
    state: {
        profile: null,
        validationErrors: {}
    },
    mutations: {
        setProfile(state, profile) {
            state.profile = profile;
        },
        setValidationErrors(state, errors) {
            state.validationErrors = errors;
        },
        clearValidationErrors(state) {
            state.validationErrors = {};
        }
    },
    actions: {
        // Public endpoint: no authorization header needed.
        async fetchPublicProfile({ commit }, avatarUniqueId) {
            try {
                const response = await apiClient.get(`/Profile/profile/${avatarUniqueId}`);
                commit('setProfile', response.data);
            } catch (error) {
                console.error("Error fetching public profile:", error);
                throw error;
            }
        },
        // Private endpoint: returns additional details if the user is logged in.
        async fetchPrivateProfile({ commit }, avatarUniqueId) {
            const token = localStorage.getItem("authToken");
            if (!token) {
                throw new Error("No auth token available for private profile fetch.");
            }
            try {
                // This endpoint is assumed to provide extra details for authenticated users.
                const response = await apiClient.get(`/Profile/details/${avatarUniqueId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('setProfile', response.data);
            } catch (error) {
                console.error("Error fetching private profile:", error);
                throw error;
            }
        },
        // Example action for updating the profile
        async updateProfile({ commit }, payload) {
            const token = localStorage.getItem("authToken");
            if (!token) {
                throw new Error("User is not authenticated.");
            }
            try {
                const response = await apiClient.patch(`/Profile/${payload.avatarUniqueId}`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('setProfile', response.data);
                return response.data;
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    commit('setValidationErrors', error.response.data.errors);
                }
                throw error;
            }
        }
    },
    getters: {
        profile: state => state.profile,
        validationErrors: state => state.validationErrors
    }
};
