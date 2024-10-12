<template>
    <div class="flex h-screen">
        <!-- Conversation List (shown on larger screens) -->
        <div class="hidden lg:block lg:w-1/4 bg-white border-r">
            <ConversationList :conversations="conversations" :selectConversation="selectConversation" />
        </div>

        <!-- Conversation List for mobile screens (full screen) -->
        <div v-if="showConversationListOnMobile" class="block lg:hidden h-full w-full">
            <ConversationList :conversations="conversations" :selectConversation="selectConversation" />
        </div>

        <!-- Chat Window (shown when a conversation is selected) -->
        <div v-if="selectedConversation" class="flex-grow">
            <MessengerComponent :messages="selectedConversation.messages" :user="selectedConversation.user" />
        </div>
    </div>
</template>

<script>
import MessengerComponent from './MessengerComponent.vue';
import ConversationList from './ConversationListComponent.vue';

export default {
    name: 'MessengerLayout',
    components: {
        MessengerComponent,
        ConversationList
    },
    data() {
        return {
            showConversationListOnMobile: true,
            selectedConversation: null,
            conversations: [
                {
                    id: 1,
                    displayName: 'Alice',
                    lastMessage: 'Hey, how are you?',
                    avatar: 'data:image/jpeg;base64,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', // Avatar base64 for Alice
                    messages: [
                        { id: 1, content: 'Hey, how are you?', sentFromUser: false, sentAt: new Date() },
                        { id: 2, content: 'I’m good, thanks! How about you?', sentFromUser: true, sentAt: new Date() }
                    ],
                    user: { displayName: 'Alice' }
                },
                {
                    id: 2,
                    displayName: 'Bob',
                    lastMessage: 'See you tomorrow!',
                    avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_2P4uXzsV2YMkLQeQoQAT25fUk9vY5i56Kw&s',
                    messages: [
                        { id: 1, content: 'See you tomorrow!', sentFromUser: false, sentAt: new Date() },
                        { id: 2, content: 'Sure! See you then!', sentFromUser: true, sentAt: new Date() }
                    ],
                    user: { displayName: 'Bob' }
                }
            ]
        };
    },
    methods: {
        selectConversation(conversation) {
            this.selectedConversation = conversation;
            // Hide the conversation list on mobile screens
            this.showConversationListOnMobile = false;
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