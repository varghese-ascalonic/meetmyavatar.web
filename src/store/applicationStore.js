export default {
    namespaced: true,
    state: () => ({
        flow: 'DEFAULT', // Represents the general webpage state
    }),
    mutations: {
        setFlow(state, flow) {
            state.flow = flow;
        },
    },
    getters: {
        flow: (state) => state.flow,
    },
};