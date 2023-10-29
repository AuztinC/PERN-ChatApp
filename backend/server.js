const express = require('express')
const app = express()
const { createServer } = require('node:http')
const { join } = require('node:path')
const { Server } = require('socket.io')

const server = createServer(app)
const io = new Server(server)

io.on('connection', (socket)=>{
    console.log(socket)
})

server.listen(process.env.PORT || 3000, () =>{
    console.log('express running')
})