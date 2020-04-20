const chatForm = document.getElementById('chat-form');
const chatMessages= document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')


// Get username and roon from URL
 const {username, room} = Qs.parse(location.search, {
     ignoreQueryPrefix: true
 })

console.log(username,room)
const socket = io();

// Join a Room 
socket.emit('joinRoom', {username, room})

// Get Room Information
socket.on('roomUsers',({room, users}) => {
    outputRoomName(room)
    outputUsers(users)
})
// Message from the server-side
socket.on('message', message =>{
    console.log(message)
    outputMessage(message)
    
    
   //scroll down 
   chatMessages.scrollTop= chatMessages.scrollHeight; 
})

// Message Submission

chatForm.addEventListener('submit', (e)=> {
    e.preventDefault();

    // GEt msg text from form
    const msg = e.target.elements.msg.value

    // Emit Message to the backend server
    socket.emit('chatMessage', msg);

// clear Input 
    e.target.elements.msg.value=''
    e.target.elements.msg.focus

})



// Output Message to the DOM

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.user} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div)
}

// Add Room Name to DOM
function outputRoomName(room){
    roomName.innerText= room;
}

// Add UsersList to a Room in DOM

function outputUsers(users) {
    userList.innerHTML= `${users.map(user => `<li>${user.username}</li>`).join('')}`
} 