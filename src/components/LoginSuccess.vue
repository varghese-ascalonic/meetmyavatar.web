<template>
    <div>
        <p v-if="token">Google login successful! Redirecting to messages...</p>
        <p v-else>Logging in with Google...</p>
    </div>
</template>

<script>

export default {
    data() {
        return {
            token: null
        };
    },
    async created() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (!code) {
            console.error("Authorization code not found.");
            return;
        }

        try {
            // Dispatch Vuex action to handle token exchange
            const authToken = await this.$store.dispatch('auth/handleGoogleCallback', code);

            // Store the auth token and set it locally
            this.token = authToken;

            // Redirect to the `/messages` page
            this.$router.push('/messages');
        } catch (error) {
            console.error("Error during token exchange:", error);
            alert("Failed to log in. Please try again.");
        }
    }
};
</script>
