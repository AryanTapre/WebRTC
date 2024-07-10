import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';


const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname =  dirname(fileURLToPath(import.meta.url));

let users = [];

io.on("connection",(socket) => {
    console.log(socket.id+" connected.");

    if(socket.connected) {
        users.push({
            id:socket.id,
            socket:socket
        })
    }

    socket.on("offer",(offer) => {
        console.log("offer received from : "+socket.id);

        users.map((user) => {
            if(user.id  != socket.id && user.socket.connected) {
                io.emit("remote-offer",offer);
            }
        })
    })

    socket.on("answer",(answer) => {
        console.log("answer received from : "+socket.id);
        console.log("answer is : " + answer);

        users.map((user) => {
            if(user.id  != socket.id && user.socket.connected) {
                io.emit("remote-answer",answer);
            }
        })
    })
})


app.get("/",(req,res) => {
    res.sendFile(join(__dirname,"./stream.html")); 
})

app.get("/join",(req,res) => {
    res.sendFile(join(__dirname,"./join_stream.html")); 
})

server.listen("3000","127.0.0.1",() => {
    
    console.log("server running on port:3000");
})