<template>
    <div class="messenger">
        <!-- Navbar (Fixed Header) -->
        <header class="header">
            <div class="flex items-center">
                <img class="h-10 w-10 rounded-full" :src="selectedConversation.avatarProfilePictureUrl"
                    alt="User avatar" />
                <div class="ml-3 text-base font-medium text-white">
                    {{ selectedConversation.avatarName }}
                </div>
            </div>
        </header>

        <!-- Messages Container (Scrollable) -->
        <main class="messages" ref="messagesContainer">
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
        <footer class="footer">
            <div class="write">
                <textarea v-model="messageContent" class="textarea" placeholder="Type a message..."></textarea>
                <button @click="handleSendMessage" class="send-button">
                    <img src="https://meetmyavatarstatic.blob.core.windows.net/staticfiles/send-icon.svg" alt="Send"
                        class="w-6 h-6" />
                </button>
            </div>
        </footer>
    </div>
</template>



<script scoped>
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
            if (!date) return ''; // Handle null/undefined safely

            let dateObj;

            if (typeof date === 'string') {
                // Convert the server string into proper ISO 8601 format.
                let isoString = date.replace(' ', 'T');
                if (!isoString.endsWith('Z')) {
                    isoString += 'Z';
                }
                isoString = isoString.replace(/(\.\d{3})\d*(Z)$/, '$1$2');
                dateObj = new Date(isoString);
            } else if (date instanceof Date) {
                // The Date object might have been parsed as local time even though the server meant UTC.
                // Adjust by adding the local timezone offset.
                dateObj = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            } else {
                dateObj = new Date(date);
            }

            if (isNaN(dateObj)) {
                console.error("Invalid date:", date);
                return "Invalid date";
            }

            return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        },


        scrollToBottom() {
            this.$nextTick(() => {
                const container = this.$refs.messagesContainer;
                container.scrollTop = container.scrollHeight;
            });
        },

        updateViewportHeight() {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        },
    },
    watch: {
        messages() {
            this.scrollToBottom();
        },
    },
    mounted() {
        window.addEventListener('resize', this.updateViewportHeight);
        this.updateViewportHeight();
        this.initializeSignalR().then(() => {
            if (this.selectedConversation.id !== 0) {
                this.loadMessages(this.selectedConversation.id);
            }
        });
        this.scrollToBottom();
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.updateViewportHeight);
    },
};
</script>


<style scoped>
/* Dynamic viewport height fix */
/* Dynamic viewport height fix */
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
    height: calc(var(--vh, 1vh) * 100);
    overflow: hidden;

    /* ✅ Background Image */
    background-image: url('https://meetmyavatarstatic.blob.core.windows.net/staticfiles/chatbackgrounds/art_in_heart_1.jpg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    /* Keeps the background static while scrolling */
    position: relative;
}

/* ✅ Dim Overlay */
.messenger::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    /* Dims the background */
    z-index: 0;
}

/* Messages Container */
.messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    -webkit-overflow-scrolling: touch;
    padding-top: 80px;
    padding-bottom: 80px;

    /* ✅ Ensure messages are above the dim overlay */
    position: relative;
    z-index: 1;
}

/* Ensure messages are above the overlay */
.messages>div {
    position: relative;
    z-index: 1;
}

@media (hover: none) and (pointer: coarse) {

    /* Styles specific to touch devices */
    .messages {
        padding-bottom: 16px;
    }
}

/* Prevent extra scrolling space */
.messages::after {
    content: '';
    display: block;
    height: 0px;
}

/* Header */
.header {
    background-color: #1f2937;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    position: fixed;
    width: 100%;
    z-index: 10;
}

/* Footer */
.footer {
    background-color: #1f2937;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 10;
    padding: 8px 16px;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.2);
}

/* Write Area */
.write {
    display: flex;
    align-items: center;
    background-color: #374151;
    border-radius: 8px;
    padding: 8px;
}

/* Textarea */
.textarea {
    flex: 1;
    border: none;
    background: transparent;
    color: white;
    outline: none;
    resize: none;
    font-size: 16px;
    height: 32px;
}

/* Prevent overlap when keyboard appears */
.textarea:focus {
    outline: none;
}

/* Send Button */
.send-button {
    background-color: #2563eb;
    padding: 8px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 8px;
}

.send-button:hover {
    background-color: #1d4ed8;
}

textarea::placeholder {
    color: #9ca3af;
}
</style>
