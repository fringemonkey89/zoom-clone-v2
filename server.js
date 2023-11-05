const express = require('express')
const app = express();
const server = require('http').Server(app);
const io  = require('socket.io')(server)
const { v4: uuidV4} = require('uuid')
const PORT = 3000;

app.set('view engine', 'ejs')
app.use(express.static('public'))


app.get('/', (req, res) => {

    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room})
})

// sets up a listener for the connection event on the io object. the connection event is triggered whenever 
//a client establishes a new connection with the server

//when a new connection is made, the provided callback function is executed and a socet object representing the
//connection is passed as an argument to the callback
io.on('connection', socket =>{
    socket.on('join-room', (roomId, userId) =>{
        // this code sets up a listnener for the 'join-room event on the socket object
        //when the client emits a join room event, passing the roomId and userId as argumemts. the provided callback function
        //is executed
        console.log(roomId, userId)
        //the socket.join() method is used to make the cocket join a specific room identified by the roomId
        //this allows the socket to communicate with other sockets that have also joined the same room
        socket.join(roomId)
        //this code emits a user-connected event to all sockets in the roomId room except the current socket that triggered the 
        //event
        //the event carries the userId information, indicating that a new user has connected to the room
        socket.to(roomId).broadcast.emit('user-connected', userId )

        // this code sets up a listener for the disconnect event on the socket object
        //when the client socket disconnects form the server, the provided callback function
        //is executed
        socket.on('disconnect', () =>{
            //this code emits a user disconnected event to al sockets in the roomId room except the current
            //socket that triggered the event
            //the event carries the userId information, indicating that a user has disconnected from the room
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})
server.listen(PORT, () => {
    console.log(`server is listening to port: ${PORT}`)
});