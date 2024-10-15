import apiClient from '../axios/api'; // Use your axios client with dynamic base URL

export default {
    namespaced: true,
    state: () => ({
        conversations: [],
        searchResults: [],
        selectedConversation: null,
    }),
    mutations: {
        setConversations(state, conversations) {
            state.conversations = conversations;
        },
        setSearchResults(state, results) {
            state.searchResults = results;
        },
        setSelectedConversation(state, conversation) {
            state.selectedConversation = conversation;
        },
    },
    actions: {
        async fetchConversations({ commit, rootState }) {
            try {
                const avatarAccessList = rootState.auth.user.userAccessMap.avatarAccessList;

                if (!avatarAccessList || avatarAccessList.length === 0) {
                    console.error('No avatars available for this user.');
                    return;
                }

                const avatarName = avatarAccessList[0].avatarName;
                const token = localStorage.getItem("authToken"); // Get the JWT token from localStorage

                const response = await apiClient.get(`/Conversation/conversations`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Set the Authorization header with the Bearer token
                    },
                    params: {
                        avatarName: avatarName
                    }
                });

                commit('setConversations', response.data);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        },
        async searchConversations({ commit }, searchQuery) {
            try {
                if (!searchQuery.trim()) {
                    commit('setSearchResults', []); // Clear search results when query is empty
                    return;
                }

                const token = localStorage.getItem("authToken");

                const response = await apiClient.get(`/Conversation/avatars`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        avatarName: searchQuery // Send search query to the API
                    }
                });

                commit('setSearchResults', response.data);
            } catch (error) {
                console.error('Error searching conversations:', error);
                commit('setSearchResults', []); // Clear search results on error
            }
        },
        async initiateConversation({ state, commit, dispatch }, { userAvatarId }) {
            try {
                const token = localStorage.getItem("authToken");

                const conversationHandshakePayload = {
                    userAvatarId: userAvatarId,
                    conversation: {
                        AvatarId: state.selectedConversation.avatarId
                    }
                };

                const response = await apiClient.post(`/Conversation/initiate`, conversationHandshakePayload, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Add the new conversation to the list
                commit('addConversation', response.data);

                // Select the newly created conversation
                commit('setSelectedConversation', response.data);
                dispatch('messenger/loadMessages', response.data.id, { root: true });

                return response.data;
            } catch (error) {
                console.error('Error initiating conversation:', error);
                throw new Error('Failed to initiate conversation.');
            }
        },
        selectConversation({ commit, dispatch, rootState }, conversation) {
            commit('setSelectedConversation', conversation);
            console.log(conversation);
            // Load messages for the selected conversation
            if (conversation.id !== 0) {
                dispatch('messenger/loadMessages', conversation.id, { root: true });
            }
            else {
                console.log("here");
                const userAvatarId = rootState.auth.user.userAccessMap.avatarAccessList[0].avatarId;

                // Dispatch the action to initiate a new conversation
                dispatch('initiateConversation', { userAvatarId }).then((newConversation) => {
                    // After initiating the conversation, load messages for the new conversation
                    dispatch('messenger/loadMessages', newConversation.id, { root: true });
                }).catch(error => {
                    console.error("Failed to initiate conversation:", error);
                });
            }

        }
    },
    getters: {
        conversations: (state) => state.conversations,
        searchResults: (state) => state.searchResults,
        selectedConversation: (state) => state.selectedConversation,
    }
};
