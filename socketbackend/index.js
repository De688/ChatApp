const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http')
const {Server} = require('socket.io')


app.use(cors)

//connecting to server

const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:'http://localhost:3000',
        methods:['GET', 'POST']
    }
})


//listening to actions

io.on('connection',(socket)=>{
   

   socket.on('join_room',(data)=>{
       socket.join(data)
       console.log(`user with ID: ${socket.id} joined room : ${data}`)

       socket.on('msg',(data)=>{
        socket.broadcast.to(data.room).emit('msg', data)
      })
        socket.on('leavechat', (name,room)=>{
            socket.leave(room)
            socket.broadcast.to(room).emit('leavemsg', {sender: "message by ChatBot", message:`${name} left this chatroom `})
        })
   })
})

server.listen(5000,()=>{
    console.log('server is running!')
})
