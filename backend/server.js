const express = require('express')
const app = express()
const client = require('./db/client')
const httpServer = require("http").createServer(app);
const options = { pingTimeout: 60000 };
const io = require("socket.io")(httpServer, options);
const path = require('path');
app.use(express.json())


const { createUser } = require('./db/users')
const { createMessage } = require('./db/messages')
const { createChat, createDefaultChat, updateChat, getSingleChat } = require('./db/chat.js')

if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));
}

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () =>{
  console.log(`listening on ${PORT}`)
})

global.activeUsers = new Map()

io.on('connection', (socket)=>{
  
  socket.on('login', (auth)=>{
    activeUsers.set(auth.id, socket.id)
    // console.log("user login", activeUsers)
  })
  
  
  socket.on('sendingMessage', async(newMessage)=>{
    const singleChat = await getSingleChat(newMessage.chatid)
    console.log(singleChat.users.forEach(user=>{
      const sendUserSocket = activeUsers.get(user.id)
      if(sendUserSocket){
        socket.to(sendUserSocket).emit("messageRecieved", newMessage)
        // console.log("user is online", sendUserSocket)
      } else {
        // console.log("user is offline")
      }
    }))
    socket.broadcast.emit("recieveMessage", newMessage)
  })
  
  
  socket.on('userTyping', (chatInfo)=>{
    socket.broadcast.emit("userTyping", chatInfo)
  })
})



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
      last_sent_username VARCHAR(20),
      last_sent_message text,
      created_at TIMESTAMP DEFAULT now(),
      isGroup BOOLEAN DEFAULT false
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
    const defaultChat = await createDefaultChat({chatName: "defaultChat"})
    const [Ethyl, Cheryl, Monique, Moe, Terry, Joe, Donk] = await Promise.all([
      createUser({username: "ethyl", password: "1234"}),
      createUser({username: "cheryl", password: "1234"}),
      createUser({username: "monique", password: "1234"}),
      createUser({username: "moe", password: "1"}),
      createUser({username: "terry", password: "1"}),
      createUser({username: "joe", password: "1"}),
      createUser({username: "donk", password: "123"}),
      
    ])
    
    const mo_tery = await createChat({user: Monique, targetUser: Terry})
    const cher_ethy = await createChat({user: Ethyl, targetUser: Cheryl})
    const joe_ethy = await createChat({user: Ethyl, targetUser: Joe})
    // console.log(allUsers)
    await updateChat({users: [Cheryl, Monique, Moe], id: mo_tery.id})
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