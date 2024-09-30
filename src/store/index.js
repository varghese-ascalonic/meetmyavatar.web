import { createStore } from 'vuex';
import authStore from './authStore';
import applicationStore from './applicationStore';

export default createStore({
  modules: {
    auth: authStore,
    application: applicationStore
  },
});