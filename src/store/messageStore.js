export default {
    namespaced: true,
    state: () => ({
        messages: [
            { id: 1, content: 'Hello!', sentAt: new Date(), sentFromUser: true },
            { id: 2, content: 'Hi there!', sentAt: new Date(), sentFromUser: false },
        ],
        user: { displayName: 'John Doe' },
    }),
    mutations: {
        addMessage(state, message) {
            state.messages.push(message);
        },
        setMessages(state, messages) {
            state.messages = messages;
        },
    },
    actions: {
        fetchMessages({ commit }) {
            // Simulate fetching messages from an API
            const messages = [
                { id: 1, content: 'Hello!', sentAt: new Date(), sentFromUser: true },
                { id: 2, content: 'Hi there!', sentAt: new Date(), sentFromUser: false },
            ];
            commit('setMessages', messages);
        },
        sendMessage({ commit }, message) {
            // Simulate sending a message
            const newMessage = {
                id: Date.now(),
                content: message.content,
                sentAt: new Date(),
                sentFromUser: true,
            };
            commit('addMessage', newMessage);
        },
    },
};
