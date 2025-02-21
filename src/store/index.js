import { createStore } from 'vuex';
import authStore from './authStore';
import applicationStore from './applicationStore';
import messageStore from './messageStore';
import conversationStore from './conversationStore';
import settingsStore from './settingsStore';
import profileStore from './profileStore';

export default createStore({
  modules: {
    auth: authStore,
    application: applicationStore,
    messenger: messageStore,
    conversation: conversationStore,
    settings: settingsStore,
    profile: profileStore
  },
});