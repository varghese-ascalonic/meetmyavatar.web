import { createStore } from 'vuex';
import authStore from './authStore';
import applicationStore from './applicationStore';
import messageStore from './messageStore';
import conversationStore from './conversationStore';

export default createStore({
  modules: {
    auth: authStore,
    application: applicationStore,
    messenger: messageStore,
    conversation: conversationStore,
  },
});