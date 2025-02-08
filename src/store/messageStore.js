import { HubConnectionBuilder } from '@microsoft/signalr';
import apiClient from '../axios/api'; // Use your axios client with dynamic base URL
import router from '../router'; // Import the router for redirects if needed

export default {
    namespaced: true,
    state: () => ({
        messages: [],
        user: { displayName: 'John Doe' }, // Set dynamically from your actual user system
        connection: null, // Holds the SignalR connection
    }),
    mutations: {
        addMessage(state, message) {
            state.messages = [...state.messages, message];
        },
        setMessages(state, messages) {
            state.messages = messages;
        },
        setConnection(state, connection) {
            state.connection = connection;
        },
    },
    actions: {
        async initializeSignalR({ commit }) {
            try {
                const token = localStorage.getItem("authToken");
                // Create the SignalR connection using dynamic base URL from Axios config
                const connection = new HubConnectionBuilder()
                    .withUrl(`${apiClient.defaults.baseURL}/chat?access_token=${token}`) // Use the baseURL from axios client
                    .withAutomaticReconnect([0, 2000, 10000, 30000])
                    .build();

                // Handle receiving messages
                connection.on('ReceiveMessage', (user, content, senderAvatarId) => {
                    const selectedConversation = this.state.conversation.selectedConversation;

                    if (selectedConversation && selectedConversation.avatarId === senderAvatarId) {
                        // Only add the message if it matches the selected conversation
                        const message = {
                            id: Date.now(),
                            content,
                            sentAt: new Date(),
                            sentFromUser: false, // Adjust logic
                        };
                        commit('addMessage', message);
                    } else {
                        console.log(`Message received for user ${senderAvatarId}, but not the selected conversation.`);
                    }
                });

                // Handle loading messages
                connection.on('ReceiveMessages', (messages) => {
                    commit('setMessages', messages.map(msg => ({
                        ...msg,
                        sentAt: new Date(msg.sentAt),
                        sentFromUser: msg.sentFromUser,
                    })));
                });

                await connection.start();
                console.log('SignalR connected.');

                commit('setConnection', connection);

            } catch (error) {
                console.error('Error initializing SignalR:', error);
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('authToken');
                    router.push('/authenticate');
                }
            }
        },
        async fetchMessages({ state }) {
            try {
                // Assuming your SignalR hub has a method to load messages
                await state.connection.invoke('LoadMessages');
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        },
        async loadMessages({ state, commit }, conversationId) {
            try {
                console.log("fetching for " + conversationId);
                // Call the LoadMessages method on the server
                await state.connection.invoke('LoadMessages', conversationId);
                // Set the current conversation ID
                commit('setConversationId', conversationId);
            } catch (error) {
                console.error('Error loading messages:', error);
            }
        },
        async sendMessage({ commit, state }, { content, senderAvatarId, recipientAvatarId }) {
            const newMessage = {
                id: Date.now(),
                content,
                sentAt: new Date().toISOString(),
                sentFromUser: true,
            };

            // Add the message to the local state immediately
            commit('addMessage', newMessage);

            try {
                // Send the message to the SignalR hub, including avatar IDs
                await state.connection.invoke('SendMessageToUser', '', content, senderAvatarId, recipientAvatarId);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        },
    },
};
