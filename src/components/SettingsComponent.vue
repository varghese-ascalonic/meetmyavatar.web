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
        <main class="p-6 relative">
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
                    <div v-if="validationErrors.displayName" class="text-red-400 text-xs mt-1">
                        {{ validationErrors.displayName }}
                    </div>
                </div>
                <div>
                    <label for="avatarId" class="block text-sm font-medium mb-1">Avatar ID</label>
                    <input id="avatarId" type="text" v-model="avatarId"
                        class="w-full p-2 bg-gray-700 text-white rounded focus:outline-none" />
                    <div v-if="validationErrors.uniqueName" class="text-red-400 text-xs mt-1">
                        {{ validationErrors.uniqueName }}
                    </div>
                </div>
                <div>
                    <label for="email" class="block text-sm font-medium mb-1">Accessing this Avatar using</label>
                    <input id="email" type="email" :value="user.email" disabled
                        class="w-full p-2 bg-gray-600 text-gray-300 rounded cursor-not-allowed" />
                </div>
                <!-- Global Prompt Textarea with Mentions -->
                <div class="relative">
                    <label for="globalPrompt" class="block text-sm font-medium mb-1">About this Avatar</label>
                    <textarea id="globalPrompt" v-model="globalPrompt" rows="3" @input="onGlobalPromptInput"
                        placeholder="Enter a brief description about your avatar. Use @ to mention others."
                        class="w-full p-2 bg-gray-700 text-white rounded focus:outline-none"></textarea>
                    <!-- Mentions Dropdown -->
                    <div v-if="mentionActive"
                        class="absolute left-0 right-0 bg-gray-700 rounded shadow-lg mt-1 max-h-40 overflow-y-auto z-10">
                        <div v-for="(name, index) in filteredMentions" :key="index" @click="selectMention(name)"
                            class="p-2 hover:bg-gray-600 cursor-pointer">
                            {{ name }}
                        </div>
                    </div>
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
            globalPrompt: '',
            defaultProfilePicture: 'https://meetmyavatarstatic.blob.core.windows.net/staticfiles/profile-default.svg',
            // For mentions
            mentionActive: false,
            mentionQuery: '',
            // In-memory list of usernames for testing
            usernames: ['alice', 'bob', 'charlie', 'dave', 'eve']
        };
    },
    computed: {
        user() {
            return this.$store.getters['auth/user'] || {};
        },
        validationErrors() {
            return this.$store.getters['settings/validationErrors'] || {};
        },
        filteredMentions() {
            if (!this.mentionQuery) return this.usernames;
            return this.usernames.filter(name =>
                name.toLowerCase().includes(this.mentionQuery.toLowerCase())
            );
        }
    },
    created() {
        this.$store.dispatch('settings/fetchAvatarProfile')
            .then(() => {
                const profile = this.$store.getters['settings/avatarProfile'];
                if (profile) {
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
            try {
                const updatedProfile = await this.$store.dispatch('settings/updateAvatarProfile', {
                    avatarName: this.displayName,
                    uniqueAvatarId: this.avatarId,
                    globalPrompt: this.globalPrompt
                });
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
                console.log('Account deleted');
            }
        },
        onGlobalPromptInput(event) {
            const value = event.target.value;
            // Update the globalPrompt
            this.globalPrompt = value;
            // Look for the last occurrence of "@" followed by word characters
            const match = value.match(/@(\w*)$/);
            if (match) {
                this.mentionActive = true;
                this.mentionQuery = match[1];
            } else {
                this.mentionActive = false;
                this.mentionQuery = '';
            }
        },
        selectMention(username) {
            // Replace the last "@" mention with the selected username followed by a space.
            this.globalPrompt = this.globalPrompt.replace(/@\w*$/, `@${username} `);
            this.mentionActive = false;
            this.mentionQuery = '';
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