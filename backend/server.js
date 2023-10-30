const express = require('express')
const app = express()
const client = require('./db/client')
const { createServer } = require('node:http')
const { Server } = require('socket.io')
const path = require('path');
const cors = require('cors')
app.use(express.json())
app.use(cors())
const { createUser } = require('./db/users')

const seed = async()=> {
    SQL = `
    DROP TABLE IF EXISTS users;
    CREATE TABLE users(
      id uuid,
      username VARCHAR(20),
      password VARCHAR(100)
    );
    `
    await client.query(SQL)
    await createUser({username: "ethyl", password: "1234"})
}

const init = async()=> {
  await client.connect();
  console.log('Connected to database!')
  if(process.env.SYNC){
    await seed()
  }
  console.log('Seeded data!')
  const PORT = process.env.PORT || 3001

  server.listen(PORT, () =>{
      console.log(`listening on ${PORT}`)
  })
}

let users = []

const server = createServer(app)
const io = new Server(server, {
    pingTimeout: 60000,
    cors:{
        origin: "http://localhost:3000",
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
const homePage = path.join(__dirname, '/frontend/public/index.html');
app.get('/', (req, res)=> res.sendFile(homePage));

module.exports = client