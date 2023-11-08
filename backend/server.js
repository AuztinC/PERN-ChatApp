const express = require('express')
const app = express()
const client = require('./db/client')
const httpServer = require("http").createServer(app);
const options = { pingTimeout: 60000 };
const io = require("socket.io")(httpServer, options);
const path = require('path');
app.use(express.json())


if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));
}

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () =>{
  console.log(`listening on ${PORT}`)
})


io.on('connection', (socket)=>{
  console.log('socket connected')
  socket.on('createMessage', (data)=>{
    // console.log(data)
  })
  
  socket.on('login', (credentials)=>{
    console.log(credentials)
  })
})



const { createUser } = require('./db/users')
const { createMessage } = require('./db/messages')
const { createChat } = require('./db/chat.js')


const seed = async()=> {
    SQL = `
    DROP TABLE IF EXISTS messages;
    DROP TABLE IF EXISTS usersChats;
    DROP TABLE IF EXISTS chat;
    DROP TABLE IF EXISTS users;
    
    CREATE TABLE users(
      id uuid PRIMARY KEY,
      username VARCHAR(20) UNIQUE,
      password VARCHAR(100),
      image TEXT
    );

    CREATE TABLE chat(
      id uuid PRIMARY KEY,
      chatName TEXT, 
      users json[],
      last_sent_userId uuid REFERENCES users(id),
      created_at TIMESTAMP DEFAULT now()
    );
    
    CREATE TABLE messages(
      id uuid PRIMARY KEY,
      chatId uuid REFERENCES chat(id),
      userId uuid REFERENCES users(id),
      message TEXT,
      created_at TIMESTAMP DEFAULT now()
    );
    `
    await client.query(SQL)
    const Ethyl = await createUser({username: "ethyl", password: "1234"})
    const Cheryl = await createUser({username: "cheryl", password: "1234"})
    const Monique = await createUser({username: "monique", password: "1234"})
    const Moe = await createUser({username: "moe", password: "1"})
    const Terry = await createUser({username: "terry", password: "1"})
    const Joe = await createUser({username: "joe", password: "1"})
    const Donk = await createUser({username: "donk", password: "123"})
    
    const defaultChat = await createChat({chatName: "defaultChat", last_sent_userId: Ethyl.id, userId: Ethyl.id, users: ["Ethyl", "Moe"]})
    const mo_tery = await createChat({chatName: "New Chat", last_sent_userId: Monique.id, userId: Monique.id, targetId: Terry.id})
    const cher_ethy = await createChat({chatName: "New Chat", last_sent_userId: Cheryl.id, userId: Ethyl.id, targetId: Cheryl.id})
    const joe_ethy = await createChat({chatName: "New Chat", last_sent_userId: Joe.id, userId: Ethyl.id, targetId: Joe.id})
    // console.log(defaultChat)
    await createMessage({chatId: defaultChat.id, userId: Monique.id, message: "hello World"})
    await createMessage({chatId: mo_tery.id, userId: Terry.id, message: "hello World"})
    await createMessage({chatId: cher_ethy.id, userId: Cheryl.id, message: "hello Worrrrld"})
    await createMessage({chatId: defaultChat.id, userId: Joe.id, message: "helLLo World"})
    await createMessage({chatId: defaultChat.id, userId: Ethyl.id, message: "h3llo World"})
    await createMessage({chatId: joe_ethy.id, userId: Joe.id, message: "hello W0rld"})
    await createMessage({chatId: joe_ethy.id, userId: Ethyl.id, message: "hello World"})
    await createMessage({chatId: defaultChat.id, userId: Cheryl.id, message: "hello World"})
    await createMessage({chatId: defaultChat.id, userId: Ethyl.id, message: "hello World 😁"})
    await createMessage({chatId: defaultChat.id, userId: Ethyl.id, message: "hellppo World"})
}
// one chat room > many message
// one message > many rooms
// 
const init = async()=> {
  await client.connect();
  console.log('Connected to database!')
  if(process.env.SYNC){
    await seed()
  }
  console.log('Seeded data!')
  

  app.use('/api', require('./api'));
}


init()


module.exports = {
  client,
}