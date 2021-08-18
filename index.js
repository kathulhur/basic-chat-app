const express = require('express');
const app = express();
const http = require('http');
const { isObject } = require('util');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server);

/*

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

*/
app.use('/socket.io', express.static('./node_modules/socket.io/client-dist/'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {// perform tasks when connection is established
    console.log('a user connected');// log the console once connected

    userConnectsMessage = "'A new user is connected!";
    socket.broadcast.emit('user connects', userConnectsMessage);
    /*
    // log the chat message to the console
    socket.on('chat message', (msg) => {
        console.log('message:' + msg);
    });
    */
    
    // send the message to everyone (including the sender)

    socket.on('chat message', (msg) => {
        console.log('message:' + msg);
        socket.broadcast.emit('chat message', msg);
    });

    // add the username to the socket and emit an event to update the list of connected sockets
    socket.on('add username', async (username) => {
        socket.data.username = username;// set the socket's username

        const sockets = await io.fetchSockets();// get all the connected sockets

        // store all the needed information in an object array
        console.log();
        console.log("Sockets connected: ");
        let socketData = [];
        for(let i = 0; i < sockets.length; ++i) {
            let id = sockets[i].id;
            let username = sockets[i].data.username;
            console.log(`id: ${id} - username: ${username}`);
            
            let data = {
                id: id,
                username: username
            }
            socketData.push(data);
        }

        // emit an event for updating the list of connected sockets (users)
        io.emit('update user list', socketData);
    });
    
    // log the console if the socket disconnects
    socket.on('disconnect', () => {
        console.log('user disconnected');
        
        userDisconnectsMessage = "A user diconnects.";
        socket.broadcast.emit('user disconnects', userDisconnectsMessage);
    });
});





server.listen(3000, () => {// listen on port 3000
    console.log('listening on *:3000');
});