<template>
    <div class="h-full bg-gray-800 text-white">
        <div class="conversation-list">
            <div v-for="conversation in conversations" :key="conversation.id"
                class="p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer"
                @click="selectConversation(conversation)">
                <div class="flex items-center">
                    <img class="h-10 w-10 rounded-full" :src="conversation.avatar" alt="User avatar" />
                    <div class="ml-3">
                        <div class="font-medium">{{ conversation.displayName }}</div>
                        <small class="text-gray-400">{{ conversation.lastMessage }}</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConversationList',
    props: {
        conversations: Array,
        selectConversation: Function
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
    /* Slightly lighter dark gray for hover */
}
</style>
