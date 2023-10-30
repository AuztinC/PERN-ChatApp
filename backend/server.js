const express = require('express')
const app = express()
const client = require('./db/client')
const { createServer } = require('node:http')
const { Server } = require('socket.io')
app.use(express.json())

const seed = async()=> {
    SQL = `
    DROP TABLE IF EXISTS users;
    CREATE TABLE users(
      id uuid,
      name VARCHAR(20)
    );
    `
    await client.query(SQL)
}

const init = async()=> {
  await client.connect();
  console.log('Connected to database!')
  if(process.env.SYNC){
    await seed()
  }
  console.log('Seeded data!')
  const PORT = process.env.PORT || 3000

  server.listen(PORT, () =>{
      console.log(`listening on ${PORT}`)
  })
}

let users = []

const server = createServer(app)
const io = new Server(server, {
    pingTimeout: 60000,
    cors:{
        origin: "http://localhost:5174",
    }
})

io.on('connection', (socket)=>{
    users.push(socket)
})

io.on('disconnect', (socket)=>{
    users.find(user=>user.id===socket.id)
})

init()
app.use('/api', require('./api'));

module.exports = client