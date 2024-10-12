import { createStore } from 'vuex';
import authStore from './authStore';
import applicationStore from './applicationStore';
import messageStore from './messageStore';

export default createStore({
  modules: {
    auth: authStore,
    application: applicationStore,
    messenger: messageStore
  },
});