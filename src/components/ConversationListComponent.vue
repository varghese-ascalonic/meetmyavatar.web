<template>
    <div class="h-full w-full bg-gradient-to-b from-gray-900 to-gray-800">
        <!-- Search Box -->
        <div class="p-4 bg-gray-800 border-b border-gray-700 shadow-md">
            <div class="flex items-center space-x-3">
                <!-- Settings Icon Button -->
                <button class="focus:outline-none" @click="navigateToSettings()">
                    <img src="https://meetmyavatarstatic.blob.core.windows.net/staticfiles/settings.svg"
                        alt="Settings Icon" class="h-6 w-6" style="filter: brightness(0) invert(0.8);" />
                </button>
                <!-- Search Input Box -->
                <input v-model="searchQuery" @input="onSearch" type="text"
                    placeholder="Search users or conversations..."
                    class="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-white" />
            </div>
        </div>

        <!-- Search Results -->
        <div v-if="searchResults.length > 0" class="search-results bg-gray-800 border-b border-gray-700">
            <div v-for="result in searchResults" :key="result.id"
                class="p-3 border-b border-gray-700 cursor-pointer hover:bg-blue-900 transition-colors duration-200"
                @click="handleSelectConversation(result)">
                <div class="font-medium text-lg text-white">{{ result.avatarName }}</div>
                <small class="text-gray-300">{{ result.lastMessage?.content || 'No messages yet' }}</small>
            </div>
        </div>

        <!-- Conversation List -->
        <div class="conversation-list overflow-y-auto" style="height: calc(100% - 8rem);">
            <div v-for="conversation in filteredConversations" :key="conversation.id"
                class="p-4 border-b border-gray-700 hover:bg-blue-900 cursor-pointer transition-colors duration-200"
                @click="goToConversationByAvatarUniqueId(conversation)">
                <div class="flex items-center space-x-4">
                    <img class="h-10 w-10 rounded-full object-cover" :src="conversation.avatarProfilePictureUrl"
                        alt="User avatar" />
                    <div>
                        <div class="font-medium text-lg text-white">{{ conversation.avatarName }}</div>
                        <small class="text-gray-300">
                            {{ conversation.lastMessage?.sentFromUser ? 'You: ' : '' }}{{
                                truncateText(conversation.lastMessage?.content, 50) }}
                        </small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'ConversationList',
    data() {
        return {
            searchQuery: '',
        };
    },
    computed: {
        ...mapState('conversation', ['conversations', 'searchResults']),
        filteredConversations() {
            // Filter conversations based on the search query
            if (this.searchQuery.trim()) {
                return this.conversations.filter(conversation =>
                    conversation.avatarName.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            }
            return this.conversations;
        }
    },
    methods: {
        ...mapActions('conversation', ['fetchConversations', 'searchConversations', 'selectConversation']),
        onSearch() {
            // Dispatch search action to Vuex when typing in the search box
            this.searchConversations(this.searchQuery);
        },
        handleSelectConversation(result) {
            // When a search result is selected, dispatch the selectConversation action.
            this.selectConversation(result)
                .then(() => {
                    // After selection (or initiating a new conversation), clear the search box...
                    this.searchQuery = '';
                    // ...and clear the search results by dispatching with an empty query.
                    this.searchConversations('');
                })
                .catch((error) => {
                    console.error("Error selecting conversation:", error);
                });
        },
        goToConversationByAvatarUniqueId(conversation) {
            this.$router.push({ name: 'MessengerSelected', params: { avatarUniqueId: conversation.avatarUniqueId } });
        },
        navigateToSettings() {
            this.$router.push('/settings');
        },
        truncateText(text, maxLength) {
            if (!text) return '';
            return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
        }
    },
    mounted() {
        this.fetchConversations(); // Fetch conversations when component is mounted
    }
};
</script>

<style scoped>
.conversation-list {
    overflow-y: auto;
    height: 100%;
}

/* Transition for a smooth hover effect */
.conversation-list div {
    transition: background-color 0.2s ease;
}

/* Hover state for conversation list items */
.conversation-list div:hover {
    background-color: #3b3f45;
}

/* Styling for search results */
.search-results div {
    transition: background-color 0.2s ease;
}

.search-results div:hover {
    background-color: #3b3f45;
}
</style>
