<template>
  <router-view></router-view>
</template>

<script>

export default {
  name: "MeetMyAvatar",
  async created() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    console.log("Authorization Code:", code); // Log the code

    if (code) {
      try {
        console.log("Dispatching to store:", this.$store); // Log the store object

        // Dispatch Vuex action to exchange the code for a token
        await this.$store.dispatch("auth/handleGoogleCallback", { code });

        console.log("Code successfully handled by the store");

        // Remove the `code` from the URL without refreshing the page
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);

        // Redirect to the `/messages` page
        this.$router.push("/messages");
      } catch (error) {
        console.error("Error during Google login:", error);
        alert("Login failed. Please try again.");
      }
    }
  },
};

</script>
