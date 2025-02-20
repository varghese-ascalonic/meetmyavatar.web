<template>
    <div class="settings-container h-full bg-gray-800 text-white">
        <!-- Header -->
        <header class="header flex items-center p-4 bg-gray-900 border-b border-gray-700">
            <button class="mr-2 focus:outline-none" @click="goBack">
                <img src="https://meetmyavatarstatic.blob.core.windows.net/staticfiles/back-arrow.svg" alt="Back"
                    class="h-6 w-6 filter invert" />
            </button>
            <h1 class="text-xl font-semibold">Settings</h1>
        </header>

        <!-- Main Content -->
        <main class="p-6">
            <!-- Profile Picture -->
            <div class="flex justify-center mb-6">
                <img :src="user.profilePictureUrl || defaultProfilePicture" alt="Profile Picture"
                    class="h-24 w-24 rounded-full border-4 border-gray-700" />
            </div>

            <!-- User Details Form -->
            <div class="space-y-4">
                <div>
                    <label for="displayName" class="block text-sm font-medium mb-1">Display Name</label>
                    <input id="displayName" type="text" v-model="displayName"
                        class="w-full p-2 bg-gray-700 text-white rounded focus:outline-none" />
                    <!-- Show validation error for displayName if present -->
                    <div v-if="validationErrors.displayName" class="text-red-400 text-xs mt-1">
                        {{ validationErrors.displayName }}
                    </div>
                </div>
                <div>
                    <label for="avatarId" class="block text-sm font-medium mb-1">Avatar ID</label>
                    <input id="avatarId" type="text" v-model="avatarId"
                        class="w-full p-2 bg-gray-700 text-white rounded focus:outline-none" />
                    <!-- Show validation error for unique avatar name if present -->
                    <div v-if="validationErrors.uniqueName" class="text-red-400 text-xs mt-1">
                        {{ validationErrors.uniqueName }}
                    </div>
                </div>
                <div>
                    <label for="email" class="block text-sm font-medium mb-1">Accessing this Avatar using</label>
                    <input id="email" type="email" :value="user.email" disabled
                        class="w-full p-2 bg-gray-600 text-gray-300 rounded cursor-not-allowed" />
                </div>
                <!-- New Global Prompt Textarea -->
                <div>
                    <label for="globalPrompt" class="block text-sm font-medium mb-1">About this Avatar</label>
                    <textarea id="globalPrompt" v-model="globalPrompt" rows="3"
                        placeholder="Enter a brief description about your avatar. The Automatic replies will be based on this description."
                        class="w-full p-2 bg-gray-700 text-white rounded focus:outline-none"></textarea>
                    <!-- Optionally, add validation error for globalPrompt if needed -->
                    <div v-if="validationErrors.globalPrompt" class="text-red-400 text-xs mt-1">
                        {{ validationErrors.globalPrompt }}
                    </div>
                </div>

            </div>

            <!-- Buttons -->
            <div class="mt-6 space-y-3">
                <button @click="saveSettings"
                    class="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium">
                    Save
                </button>
                <button @click="logout" class="w-full py-2 bg-red-600 hover:bg-red-700 rounded text-white font-medium">
                    Logout
                </button>
                <button @click="deleteAccount"
                    class="w-full py-2 bg-gray-600 hover:bg-gray-700 rounded text-white font-medium">
                    Delete Account
                </button>
            </div>
        </main>
    </div>
</template>

<script>
export default {
    name: 'SettingsComponent',
    data() {
        return {
            displayName: '',
            avatarId: '',
            globalPrompt: '', // New field for the global prompt
            defaultProfilePicture: 'https://meetmyavatarstatic.blob.core.windows.net/staticfiles/profile-default.svg'
        };
    },
    computed: {
        // Get user info from the auth module.
        user() {
            return this.$store.getters['auth/user'] || {};
        },
        // Get any validation errors from the settings store.
        validationErrors() {
            return this.$store.getters['settings/validationErrors'] || {};
        }
    },
    created() {
        // Fetch the avatar profile when the page loads.
        this.$store.dispatch('settings/fetchAvatarProfile')
            .then(() => {
                const profile = this.$store.getters['settings/avatarProfile'];
                if (profile) {
                    // Note: mapping API properties to component data.
                    this.displayName = profile.avatarName;
                    this.avatarId = profile.uniqueAvatarId;
                    this.globalPrompt = profile.globalPrompt || '';
                }
            })
            .catch(err => {
                console.error("Error fetching avatar profile:", err);
            });
    },
    methods: {
        goBack() {
            this.$router.push({ name: 'MessengerList' });
        },
        async saveSettings() {
            // Dispatch the update action from the settings store.
            try {
                const updatedProfile = await this.$store.dispatch('settings/updateAvatarProfile', {
                    avatarName: this.displayName,
                    uniqueAvatarId: this.avatarId,
                    globalPrompt: this.globalPrompt  // Include globalPrompt in the payload
                });
                // Optionally update local fields with the updated profile.
                this.displayName = updatedProfile.avatarName;
                this.avatarId = updatedProfile.uniqueAvatarId;
                this.globalPrompt = updatedProfile.globalPrompt || '';
                alert('Profile updated successfully!');
            } catch (error) {
                console.error("Error updating profile:", error);
            }
        },
        logout() {
            this.$store.dispatch('auth/logout');
            this.$router.push('/authenticate');
        },
        deleteAccount() {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                // Implement account deletion logic here.
                console.log('Account deleted');
            }
        }
    }
};
</script>

<style scoped>
.settings-container {
    min-height: 100vh;
    max-width: 600px;
    margin: 0 auto;
}

:global(body) {
    background-color: #2d3748;
}
</style>
