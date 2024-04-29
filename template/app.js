class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button'),
            inputField: document.querySelector('.chatbox__footer input[type="text"]'),
            messagesContainer: document.querySelector('.chatbox__messages div')
        }

        this.state = false;
        this.messages = [];
    }

    display() {
        const {openButton, chatBox, sendButton, inputField} = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox))

        sendButton.addEventListener('click', () => this.onSendButton(chatBox))

        inputField.addEventListener("keyup", ({key}) => {
            if (key === "Enter") {
                this.onSendButton(chatBox)
            }
        })
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hide the box
        chatbox.classList.toggle('chatbox--active', this.state);

        // fetch messages if chatbox is open
        if (this.state) {
            this.fetchMessages();
        }
    }

    onSendButton(chatbox) {
        const {inputField} = this.args;
        let text = inputField.value.trim();
        
        if (text === "") {
            return;
        }

        let userMessage = { name: "User", message: text }
        this.messages.push(userMessage);

        this.updateChatText(chatbox);
        inputField.value = '';

        this.sendMessageToChatbot(text);
    }

    sendMessageToChatbot(message) {
        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message }),
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
          })
          .then(r => r.json())
          .then(r => {
            let botMessage = { name: "DabaDoc", message: r.answer };
            this.messages.push(botMessage);
            this.updateChatText(this.args.chatBox);
        }).catch((error) => {
            console.error('Error:', error);
            this.updateChatText(this.args.chatBox);
        });
    }

    updateChatText(chatbox) {
        if (!this.state) {
            return;
        }
        
        const html = this.messages.map(item => {
            const className = item.name === "DabaDoc" ? "messages__item--visitor" : "messages__item--operator";
            return `<div class="messages__item ${className}">${item.message}</div>`;
        }).reverse().join('');

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }

    fetchMessages() {
        if (!this.state) {
            return;
        }
        
        // Fetch messages from the server or any source
        // and update this.messages array

        // For demo purposes, simulate receiving a message after a short delay
        setTimeout(() => {
            const botMessage = { name: "DabaDoc", message: "Hello!👋🏻😄 I'm DabaDoc Chatbot. How can I assist you?" };
            this.messages.push(botMessage);
            this.updateChatText(this.args.chatBox);
        }, 1000);
    }
}


const chatbox = new Chatbox();
chatbox.display();
