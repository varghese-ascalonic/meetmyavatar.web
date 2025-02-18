<template>
    <div class="flex h-screen overflow-hidden"> <!-- Main container takes full screen height and no overflow -->
        <!-- Conversation List (shown on larger screens) -->
        <div class="hidden lg:flex lg:w-1/4 bg-gray-900 border-r">
            <ConversationList :conversations="conversations" :selectConversation="handleConversationSelection" />
        </div>

        <!-- Conversation List for mobile screens (full screen) -->
        <div v-if="!selectedConversation" class="block lg:hidden h-full w-full bg-gray-900">
            <ConversationList :conversations="conversations" :selectConversation="handleConversationSelection" />
        </div>

        <!-- Chat Window (shown when a conversation is selected) -->
        <div v-if="selectedConversation" class="flex-grow flex flex-col h-full">
            <MessengerComponent :messages="selectedConversation.messages" :user="selectedConversation.user" />
        </div>
    </div>
</template>


<script>
import MessengerComponent from './MessengerComponent.vue';
import ConversationList from './ConversationListComponent.vue';
import { mapState, mapActions } from 'vuex';

export default {
    name: 'MessengerLayout',
    components: {
        MessengerComponent,
        ConversationList
    },
    data() {
        return {
            showConversationListOnMobile: true,
        };
    },
    computed: {
        ...mapState('conversation', ['conversations', 'selectedConversation']),
        avatarUniqueIdFromUrl() {
            return this.$route.params.avatarUniqueId;
        }
    },
    watch: {
        // When the route changes, update the selected conversation accordingly
        avatarUniqueIdFromUrl(newVal) {
            if (newVal) {
                this.selectConversationByUniqueAvatarId(newVal);
            } else {
                this.clearSelectedConversation();
            }
        }
    },
    methods: {
        ...mapActions('conversation', ['fetchConversations', 'selectConversation']),
        ...mapActions('auth', ['fetchUserInfo']),

        handleConversationSelection(conversation) {
            this.selectConversation(conversation);
            this.showConversationListOnMobile = false; // Hide conversation list on mobile screens
        },
        async selectConversationByUniqueAvatarId(avatarUniqueId) {
            // Ensure conversations are loaded
            await this.fetchConversations();

            // Find the conversation with the matching avatarId
            const matchingConversation = this.conversations.find(
                (conv) => conv.avatarUniqueId === avatarUniqueId
            );

            if (matchingConversation) {
                // Select the matching conversation via the Vuex action
                this.selectConversation(matchingConversation);
            } else {
                // If no matching conversation is found, clear the selection
                this.clearSelectedConversation();
                console.warn(`No conversation found for avatar: ${avatarUniqueId}`);
            }
        },
        clearSelectedConversation() {
            this.$store.commit('conversation/setSelectedConversation', null);
        }
    },
    async mounted() {
        try {
            await this.fetchUserInfo(); // Fetch the user info on component mount
            this.fetchConversations();  // Fetch conversations when user info is loaded
        } catch (error) {
            console.error('Error fetching user info or conversations:', error);
        }
        if (this.avatarUniqueIdFromUrl) { // Use avatarUniqueIdFromUrl instead of conversationEmail
            await this.selectConversationByUniqueAvatarId(this.avatarUniqueIdFromUrl);
        }
    }
};
</script>

<style scoped>
/* Ensure conversation list items extend full width on mobile */
.conversation-list-item {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e2e8f0;
    /* Light border */
    cursor: pointer;
    width: 100%;
    /* Make sure the items take the full width */
    box-sizing: border-box;
    /* Ensure padding is included in the width calculation */
}

.conversation-list-item:hover {
    background-color: #f9fafb;
    /* Lighter background on hover */
}

/* For mobile screens, ensure the list takes full width */
@media (max-width: 1024px) {
    .conversation-list-item {
        width: 100%;
        /* Full width on small screens */
    }

    .conversation-list {
        display: block;
        /* Ensure the conversation list is visible on mobile */
    }
}

/* Make sure the conversation list container takes the full height and width */
.conversation-list {
    height: 100%;
    width: 100%;
    overflow-y: auto;
}

.conversation-list img {
    flex-shrink: 0;
}

.conversation-list div {
    flex-grow: 1;
}
</style>