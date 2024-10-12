<template>
    <div class="flex flex-col h-screen">
        <!-- Navbar -->
        <div class="flex items-center bg-gray-800 text-white p-4 shadow">
            <!-- User Info -->
            <img class="h-10 w-10 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User avatar" />
            <div class="ml-3">
                <div class="text-base font-medium">{{ user.displayName }}</div>
            </div>
        </div>

        <!-- Messages Container -->
        <div class="flex-grow overflow-auto p-4" ref="messagesContainer">
            <div class="messages flex-1 overflow-auto">
                <div v-for="message in messages" :key="message.id" class="message mb-4 flex"
                    :class="{ 'text-right': message.sentFromUser }">
                    <div class="flex-1 px-2">
                        <div :class="message.sentFromUser ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'"
                            class="inline-block rounded-full p-2 px-6">
                            <span>{{ message.content }}</span>
                        </div>
                        <div class="pl-4">
                            <small class="text-gray-500">{{ formatDate(message.sentAt) }}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Textbox and Send Button -->
        <div class="flex-2 pt-4 pb-10">
            <div class="write bg-white shadow flex rounded-lg">
                <div class="flex-1">
                    <textarea v-model="messageContent" class="w-full block outline-none py-4 px-4 bg-transparent"
                        rows="1" placeholder="Type a message..." />
                </div>
                <div class="flex-2 w-32 p-2 flex items-center justify-center">
                    <button @click="sendMessage" class="bg-blue-400 w-10 h-10 rounded-full inline-block">
                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2" viewBox="0 0 24 24" class="w-4 h-4 text-white">
                            <path d="M5 13l4 4L19 7"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'MessengerComponent',
    data() {
        return {
            messageContent: '',
        };
    },
    computed: {
        ...mapState('messenger', ['messages', 'user']),
    },
    methods: {
        ...mapActions('messenger', ['sendMessage', 'fetchMessages']),
        sendMessage() {
            if (this.messageContent.trim()) {
                this.sendMessage({ content: this.messageContent });
                this.messageContent = ''; // Clear input
            }
        },
        formatDate(date) {
            const options = { hour: '2-digit', minute: '2-digit' };
            return new Date(date).toLocaleTimeString(undefined, options);
        },
        scrollToBottom() {
            this.$nextTick(() => {
                const container = this.$refs.messagesContainer;
                container.scrollTop = container.scrollHeight;
            });
        },
    },
    watch: {
        messages() {
            this.scrollToBottom();
        },
    },
    mounted() {
        this.fetchMessages(); // Initial fetch of messages
        this.scrollToBottom(); // Scroll on initial render
    },
};
</script>

<style scoped>
.message {
    display: flex;
    align-items: flex-start;
}
</style>