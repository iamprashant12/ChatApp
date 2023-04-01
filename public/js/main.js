const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const socket = io();

// Output message from server
socket.on('message',(message)=>{
    console.log(message);
    outPutMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    // Get message text
    const message= e.target.elements.msg.value;

    // Emit message to server
    socket.emit('chatMessage',message)

    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
})

// Output message to DOM
function outPutMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}