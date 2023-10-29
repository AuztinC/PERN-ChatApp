const express = require('express')
const app = express()
const { createServer } = require('node:http')
const { join } = require('node:path')
const { isNullOrUndefined } = require('node:util')
const { Server } = require('socket.io')

let users = []

const server = createServer(app)
const io = new Server(server, {
    pingTimeout: 60000,
    cors:{
        origin: "http://localhost:5174",
    }
})

app.use('/', (req, res)=>{
    
})

io.on('connection', (socket)=>{
    users.push(socket)
})

io.on('disconnect', (socket)=>{
    users.find(user=>user.id===socket.id)
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () =>{
    console.log(`${PORT}`)
})