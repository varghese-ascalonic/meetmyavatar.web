<template>
    <div class="flex flex-col h-screen bg-gray-900 text-white">
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
        </div>

        <!-- Textbox and Send Button -->
        <div class="flex-none px-4 py-2 bg-gray-800">
            <div class="write bg-gray-700 shadow flex rounded-full items-center px-3">
                <div class="flex-1">
                    <textarea v-model="messageContent"
                        class="w-full block outline-none py-3 px-4 bg-transparent text-white placeholder-gray-400 resize-none"
                        rows="1" placeholder="Type a message..." />
                </div>
                <div class="flex-2 p-1 flex items-center justify-center">
                    <button @click="handleSendMessage"
                        class="bg-blue-600 w-12 h-12 rounded-full inline-block flex items-center justify-center hover:bg-blue-500 transition-all">
                        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2" viewBox="0 0 24 24" class="w-6 h-6 text-white">
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
        ...mapState('auth', ['user']), 
        ...mapState('conversation', ['selectedConversation'])
    },
    methods: {
        ...mapActions('messenger', ['sendMessage', 'loadMessages', 'initializeSignalR']),

        // Renamed method to avoid recursion
        handleSendMessage() {
            if (this.messageContent.trim()) {

                const senderAvatarId = this.user.userAccessMap.avatarAccessList[0]?.avatarId; // First avatarId
                const recipientAvatarId = this.selectedConversation?.avatarId; 

                const messagePayload = {
                    content: this.messageContent,
                    senderAvatarId: senderAvatarId,  // Assuming you have the sender's avatarId in the user state
                    recipientAvatarId: recipientAvatarId  // Assuming the recipient's avatarId is selected
                };
                this.sendMessage(messagePayload).then(() => {
                    this.scrollToBottom(); // Scroll to the bottom after sending the message
                });// Dispatch to Vuex action
                this.messageContent = '';  // Clear input
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
            console.log("try to scroll")
            this.scrollToBottom();
        },
    },
    mounted() {
        this.initializeSignalR().then(() => {
            if(this.selectedConversation.id !== 0) {
                this.loadMessages(this.selectedConversation.id);  
            }
            else {
                console.log(this.user.userAccessMap.avatarAccessList[0]?.avatarId);
                //this.loadMessages(this.selectedConversation.id);
            }
        });
        this.scrollToBottom();
    },
};
</script>

<style scoped>
.message {
    display: flex;
    align-items: flex-start;
}

/* Responsive styles for textarea */
textarea {
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    background-color: transparent;
    color: white;
    padding: 10px;
    font-size: 16px;
}

.write {
    display: flex;
    align-items: center;
    background-color: #1f2937;
    border-radius: 50px;
    padding-left: 15px;
}

textarea::placeholder {
    color: #9ca3af;
}

button {
    background-color: #3b82f6;
}

button:hover {
    background-color: #2563eb;
}

button:active {
    background-color: #1d4ed8;
}
</style>
