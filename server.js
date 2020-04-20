const path = require('path')
const http = require('http')
const express= require('express');
const socketio= require('socket.io')
const formatMessage = require('./dataItems/messages')
const {userJoin, getCurrentUser, getRoomUsers, userLeave} = require('./dataItems/users')



const app = express();
const server = http.createServer(app) 
const io = socketio(server)

const botName = "ChatBot"
// Set Static Folder
app.use(express.static(path.join(__dirname,'public')))


// Run when a client connects

io.on('connection', socket => {
    socket.on('joinRoom',({username, room})=>{

        const user= userJoin(socket.id, username, room);
        socket.join(user.room)
        // Welcome Client
        socket.emit('message',formatMessage(botName,'Welcome to the chat App'));

        // Broadcast when a client connets to the App
        socket.broadcast
        .to(user.room)
        .emit('message', formatMessage(botName,`${user.username} has joined The chat`)) 
        // Send Room Info 
        io.to(user.room).emit('roomUsers', {
            room:user.room,
            users: getRoomUsers(user.room)
        })
    })

// Listen for a chat message 
 socket.on('chatMessage', msg=>{
     const user = getCurrentUser(socket.id)
     io.to(user.room).emit('message',formatMessage(`${user.username}`,msg)); 
 })

 // When a client disconnects 
 socket.on('disconnect', ()=>{
     const user= userLeave(socket.id)

     if (user){
        io.to(user.room).emit('message', formatMessage(botName,`${user.username} has Left The room`))
     }

      // Send Room Info 
      io.to(user.room).emit('roomUsers', {
        room:user.room,
        users: getRoomUsers(user.room)
    })
    
});

})
  

const PORT = 3000 || process.env.PORT;

server.listen(PORT, ()=> console.log(`Server Running on port ${PORT}`));