<template>
  <div>
    <!-- Progress Bar (fixed at the top) -->
    <div v-if="loading" class="progress-bar"></div>
    <router-view></router-view>
  </div>
</template>

<script>
import apiClient from './axios/api';

export default {
  name: "MeetMyAvatar",
  data() {
    return {
      loadingCount: 0,
    };
  },
  computed: {
    loading() {
      return this.loadingCount > 0;
    }
  },
  async created() {
    // Attach a request interceptor to increment loadingCount
    apiClient.interceptors.request.use(
      config => {
        this.loadingCount++;
        return config;
      },
      error => Promise.reject(error)
    );

    // Attach a response interceptor to decrement loadingCount
    apiClient.interceptors.response.use(
      response => {
        this.loadingCount = Math.max(0, this.loadingCount - 1);
        return response;
      },
      error => {
        this.loadingCount = Math.max(0, this.loadingCount - 1);
        return Promise.reject(error);
      }
    );

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    console.log("Authorization Code:", code);

    if (code) {
      try {
        console.log("Dispatching to store:", this.$store);
        await this.$store.dispatch("auth/handleGoogleCallback", { code });
        console.log("Code successfully handled by the store");

        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);

        this.$router.push("/messages");
      } catch (error) {
        console.error("Error during Google login:", error);
        alert("Login failed. Please try again.");
      }
    }
  },
};
</script>

<style scoped>
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  background-color: #ffffff;
  width: 0%;
  animation: progressBar 2s linear infinite;
  z-index: 9999;
}

@keyframes progressBar {
  0% {
    width: 0%;
  }

  25% {
    width: 50%;
  }

  50% {
    width: 80%;
  }

  75% {
    width: 95%;
  }

  100% {
    width: 100%;
  }
}
</style>
