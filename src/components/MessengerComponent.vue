<template>
    <div class="messenger flex flex-col">
        <!-- Navbar (Fixed Header) -->
        <header class="header bg-gray-800 p-4 shadow">
            <div class="flex items-center">
                <img class="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                    alt="User avatar" />
                <div class="ml-3 text-base font-medium">
                    {{ user.displayName }}
                </div>
            </div>
        </header>

        <!-- Messages Container (Scrollable) -->
        <main class="messages flex-1 overflow-y-auto p-4" ref="messagesContainer">
            <div>
                <div v-for="message in messages" :key="message.id" class="mb-4 flex"
                    :class="{ 'text-right': message.sentFromUser }">
                    <div class="flex-1 px-2">
                        <div :class="message.sentFromUser ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'"
                            class="inline-block rounded-lg p-2 px-4 max-w-xs">
                            <span>{{ message.content }}</span>
                        </div>
                        <div class="pl-4">
                            <small class="text-gray-400">{{ formatDate(message.sentAt) }}</small>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Textbox and Send Button (Fixed Footer) -->
        <footer class="footer bg-gray-800 p-2">
            <div class="write bg-gray-700 shadow flex rounded-full items-center px-3">
                <div class="flex-1">
                    <textarea v-model="messageContent"
                        class="textarea w-full block outline-none py-3 px-4 bg-transparent text-white placeholder-gray-400 resize-none"
                        rows="1" placeholder="Type a message..."></textarea>
                </div>
                <div class="flex-2 p-1 flex items-center justify-center">
                    <button @click="handleSendMessage"
                        class="send-button bg-blue-600 w-12 h-12 rounded-full inline-block flex items-center justify-center hover:bg-blue-500 transition-all">
                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2" viewBox="0 0 24 24" class="w-6 h-6 text-white">
                            <path d="M5 13l4 4L19 7"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </footer>
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
        ...mapState('messenger', ['messages']),
        ...mapState('auth', ['user']),
        ...mapState('conversation', ['selectedConversation']),
    },
    methods: {
        ...mapActions('messenger', ['sendMessage', 'loadMessages', 'initializeSignalR']),

        handleSendMessage() {
            if (this.messageContent.trim()) {
                const senderAvatarId = this.user.userAccessMap.avatarAccessList[0]?.avatarId;
                const recipientAvatarId = this.selectedConversation?.avatarId;

                const messagePayload = {
                    content: this.messageContent,
                    senderAvatarId,
                    recipientAvatarId,
                };
                this.sendMessage(messagePayload).then(() => {
                    this.scrollToBottom();
                });
                this.messageContent = '';
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
        this.initializeSignalR().then(() => {
            if (this.selectedConversation.id !== 0) {
                this.loadMessages(this.selectedConversation.id);
            }
        });
        this.scrollToBottom();
    },
};
</script>


<style scoped>
/* Ensure consistent height for the layout */
html,
body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow: hidden;
}

.messenger {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

/* Header (Sticky at the top) */
.header {
    position: sticky;
    top: 0;
    z-index: 10;
}

/* Messages Container */
.messages {
    flex: 1;
    overflow-y: auto;
    padding-bottom: 16px;
    /* Prevent overlap with footer */
    -webkit-overflow-scrolling: touch;
    /* Smooth scrolling for iOS */
}

/* Footer (Sticky at the bottom) */
.footer {
    position: sticky;
    bottom: 0;
    z-index: 10;
    background-color: #1f2937;
    flex-shrink: 0;
    padding: 10px;
}

/* Textbox */
.textarea {
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    background-color: transparent;
    color: white;
    padding: 10px;
    font-size: 16px;
}

/* Send Button */
.send-button {
    background-color: #3b82f6;
}

.send-button:hover {
    background-color: #2563eb;
}

.send-button:active {
    background-color: #1d4ed8;
}

textarea::placeholder {
    color: #9ca3af;
}
</style>
