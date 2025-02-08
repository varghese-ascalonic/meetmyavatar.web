<template>
    <div class="h-full bg-gray-800 text-white" style="width: 100%;">
        <!-- Search Box -->
        <div class="p-4 bg-gray-900 border-b border-gray-700">
            <div class="flex items-center">
                <!-- Settings Icon Button on the left side -->
                <button class="mr-2 focus:outline-none bg-gray-300 hover:bg-gray-400 rounded-full p-2">
                    <img src="https://meetmyavatarstatic.blob.core.windows.net/staticfiles/settings.svg"
                        alt="Settings Icon" class="h-6 w-6" />
                </button>
                <!-- Search Input Box -->
                <input v-model="searchQuery" @input="onSearch" type="text"
                    placeholder="Search users or conversations..."
                    class="w-full p-2 bg-gray-700 text-white rounded focus:outline-none" />
            </div>
        </div>

        <!-- Search Results (only shown if search results are present) -->
        <div v-if="searchResults.length > 0" class="search-results p-4 bg-gray-800">
            <div v-for="result in searchResults" :key="result.id"
                class="p-2 border-b border-gray-700 cursor-pointer hover:bg-gray-700"
                @click="selectConversation(result)">
                <div class="font-medium">{{ result.avatarName }}</div>
                <small class="text-gray-400">{{ result.lastMessage?.content || 'No messages yet' }}</small>
            </div>
        </div>

        <!-- Conversation List -->
        <div class="conversation-list">
            <div v-for="conversation in filteredConversations" :key="conversation.id"
                class="p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer"
                @click="selectConversation(conversation)">
                <div class="flex items-center">
                    <img class="h-10 w-10 rounded-full" :src="conversation.avatarProfilePictureUrl" alt="User avatar" />
                    <div class="ml-3">
                        <div class="font-medium">{{ conversation.avatarName }}</div>
                        <small class="text-gray-400">
                            {{ conversation.lastMessage?.sentFromUser ? 'You: ' : '' }}{{
                                conversation.lastMessage?.content }}
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
