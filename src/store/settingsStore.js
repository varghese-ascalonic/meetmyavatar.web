// settingsStore.js
import apiClient from '../axios/api';

export default {
    namespaced: true,
    state: {
        avatarProfile: null,
        validationErrors: {}
    },
    mutations: {
        setAvatarProfile(state, profile) {
            state.avatarProfile = profile;
        },
        setValidationErrors(state, errors) {
            state.validationErrors = errors;
        },
        clearValidationErrors(state) {
            state.validationErrors = {};
        }
    },
    actions: {
        async fetchAvatarProfile({ commit, rootState }) {
            const token = localStorage.getItem("authToken");
            // Get the avatarId from the auth module's userAccessMap:
            const avatarAccessList = rootState.auth.user.userAccessMap?.avatarAccessList;
            const avatarId =
                avatarAccessList && avatarAccessList.length > 0
                    ? avatarAccessList[0].avatarId
                    : null;
            if (!avatarId) {
                throw new Error("No avatarId found in the user access map.");
            }
            try {
                // Assuming your API route is /api/avatar/avatar-profile/{avatarId}
                const response = await apiClient.get(`/settings/avatar-profile/${avatarId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('setAvatarProfile', response.data);
            } catch (error) {
                console.error("Error fetching avatar profile", error);
                throw error;
            }
        },
        async updateAvatarProfile({ commit, rootState }, payload) {
            const token = localStorage.getItem("authToken");
            // payload is expected to have { avatarName, uniqueAvatarId }
            // Get the avatarId from the auth module's userAccessMap:
            const avatarAccessList = rootState.auth.user.userAccessMap?.avatarAccessList;
            const avatarId =
                avatarAccessList && avatarAccessList.length > 0
                    ? avatarAccessList[0].avatarId
                    : null;
            if (!avatarId) {
                throw new Error("No avatarId found in the user access map.");
            }
            commit('clearValidationErrors');
            try {
                // Call the PATCH endpoint:
                const response = await apiClient.patch(`/settings/avatar-profile/${avatarId}`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                commit('setAvatarProfile', response.data);
                return response.data;
            } catch (error) {
                // If the server responds with a 400, we expect a dictionary of errors.
                if (error.response && error.response.status === 400) {
                    commit('setValidationErrors', error.response.data.errors);
                }
                throw error;
            }
        }
    },
    getters: {
        avatarProfile: (state) => state.avatarProfile,
        validationErrors: (state) => state.validationErrors
    }
};
