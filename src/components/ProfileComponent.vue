<template>
    <div>
        <!-- Profile Card -->
        <div class="max-w-lg mx-auto bg-white shadow-xl overflow-hidden rounded-none lg:rounded-lg">
            <!-- Cover Photo -->
            <div class="h-36 bg-cover bg-center"
                style="background-image: url('https://meetmyavatarstatic.blob.core.windows.net/staticfiles/chatbackgrounds/art_in_heart_3.jpg');">
            </div>
            <!-- Profile Header -->
            <div class="flex items-center px-6 py-4 mt-0 lg:-mt-12">
                <img :src="profile.profilePictureUrl || defaultProfilePicture" alt="Profile Picture"
                    class="w-24 h-24 border-4 border-white rounded-full object-cover bg-gray-200" />
                <div class="ml-4">
                    <h1 class="text-2xl font-bold text-gray-800">{{ profile.avatarName }}</h1>
                    <p class="text-gray-600">@{{ profile.uniqueAvatarId }}</p>
                    <p class="text-sm text-gray-500">Joined on {{ profile.createdOn }}</p>
                </div>
            </div>
            <!-- Bio/Global Prompt (if any) -->
            <div class="px-6 py-4 border-t border-gray-200" v-if="profile.globalPrompt">
                <p class="text-gray-700">{{ profile.globalPrompt }}</p>
            </div>
        </div>

        <!-- Action Buttons -->
        <div v-if="!isAuthenticated" class="max-w-lg mx-auto mt-6 space-y-4 px-4">
            <button @click="goToMessages"
                class="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
                <!-- Chat Icon -->
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.96 9.96 0 01-4-.8L3 21l1.8-3.6A8.966 8.966 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                    </path>
                </svg>
                <span>Chat with this avatar</span>
            </button>
            <button @click="goToMessages"
                class="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg">
                <!-- Create Icon -->
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
                </svg>
                <span>Create your avatar</span>
            </button>
        </div>

        <!-- Settings Section (only for authenticated users) -->
        <div v-if="isAuthenticated" class="max-w-lg mx-auto mt-6 px-4">
            <div class="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">Preferences</h2>
                <div class="flex items-center justify-between">
                    <span class="text-gray-700 font-medium">Automatic Reply</span>
                    <label class="inline-flex relative items-center cursor-pointer">
                        <input type="checkbox" v-model="autoReplyEnabled"
                            @change="updateAutoReplyPreference(autoReplyEnabled)" class="sr-only peer" />
                        <div
                            class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all">
                        </div>
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'ProfileComponent',
    data() {
        return {
            defaultProfilePicture: 'https://meetmyavatarstatic.blob.core.windows.net/staticfiles/profile-default.svg',
            autoReplyEnabled: true,
            conversationWithThisAvatar: null,
        };
    },
    computed: {
        // Retrieve profile from profileStore.
        profile() {
            return this.$store.getters['profile/profile'] || {};
        },
        isAuthenticated() {
            const token = localStorage.getItem('authToken');
            if (!token) return false;

            try {
                const tokenPayload = JSON.parse(atob(token.split('.')[1]));
                const expirationTime = tokenPayload.exp * 1000;
                return Date.now() < expirationTime;
            } catch (err) {
                return false;
            }
        }
    },
    created() {
        const avatarUniqueId = this.$route.params.avatarUniqueId;
        const token = localStorage.getItem('authToken');
        const isAuthenticated = !!token;

        if (isAuthenticated) {
            // ✅ Fetch current user info first
            this.$store.dispatch('auth/fetchUserInfo')
                .then(() => {
                    const avatarAccessList = this.$store.getters['auth/userAccessMap']?.avatarAccessList;
                    const myAvatarId = avatarAccessList[0].avatarId;

                    // ✅ Fetch private profile
                    this.$store.dispatch('profile/fetchPrivateProfile', avatarUniqueId);

                    // ✅ Fetch conversations for my avatar
                    this.fetchConversationsAndFindCurrent(avatarUniqueId, myAvatarId);
                })
                .catch(err => console.error('Error during user info fetch:', err));
        } else {
            this.$store.dispatch('profile/fetchPublicProfile', avatarUniqueId)
                .catch((err) => console.error('Error fetching public profile:', err));
        }
    },
    methods: {
        ...mapActions('conversation', ['fetchConversations']),
        goToMessages() {
            // Store the current avatar details in localStorage under the key "chatWith"
            localStorage.setItem('chatWith', JSON.stringify(this.profile));
            // Navigate to the messages page.
            this.$router.push({ name: 'MessengerList' });
        },

        async fetchConversationsAndFindCurrent(profileAvatarUniqueId, myAvatarId) {
            try {
                // ✅ Fetch conversations for my avatar
                await this.$store.dispatch('conversation/fetchConversations');

                const conversations = this.$store.getters['conversation/conversations'];

                // ✅ Find conversation where one avatar is mine and the other is the current profile
                const match = conversations.find(c =>
                    (c.userAvatarId === myAvatarId && c.recipientAvatarUniqueId === profileAvatarUniqueId) ||
                    (c.recipientAvatarId === myAvatarId && c.userAvatarUniqueId === profileAvatarUniqueId)
                );

                console.log(match.autoReplyFromMe);

                if (match) {
                    this.conversationWithThisAvatar = match;
                    this.autoReplyEnabled = match.autoReplyFromMe;
                }
            } catch (error) {
                console.error('Failed to fetch or match conversation:', error);
            }
        },

        async updateAutoReplyPreference() {
            if (!this.conversationWithThisAvatar) return;

            try {


                // Optional: Toast or success message
                console.log('updating auto-reply preference.');
            } catch (error) {
                console.error('Failed to update auto-reply setting:', error);
            }
        }
    }
};
</script>