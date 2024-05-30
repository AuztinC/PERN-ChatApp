import React, { useState, useEffect } from 'react';
// import { io } from "socket.io-client";
import api from './api';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';
import Users from './components/Users'
import { Routes, Route } from 'react-router-dom'
// const socket = io()
import { socket } from './socket';
function App() {
  const [auth, setAuth] = useState({})
  const [messages, setMessages] = useState([])
  const [notifications, setNotifications] = useState([])
  const [users, setAllUsers] = useState([])
  const [allChats, setAllChats] = useState([])
  
  const attemptLoginWithToken = async() =>{
    await api.attemptLoginWithToken(setAuth)
  }
  
  
  socket.on('receiveMessage', newMessage=>{
    // if(allChats.find(chat=>chat.id === newMessage.chatId)){
    //   setMessageRecieved(true)
    //   api.getAllMessages(setMessages)
    // }
    // api.getAllMessages(setMessages)
    // setMessages([...messages, newMessage])
    // console.log(newMessage)
  })
  useEffect(()=> {
    attemptLoginWithToken()
    api.getDefaultChat(setAllChats)
    api.getAllMessages(setMessages)
    api.getAllUsers(setAllUsers)
  }, [])
  
  useEffect(()=>{
    if(!auth.id){
      // api.getDefaultChat(setAllChats)
    } else{
      // console.log("FIRed")
      api.getAllMessages(setMessages)
      api.getAllUsers(setAllUsers)
      api.getAllChats(setAllChats, auth)
      socket.emit('login', auth)
    }
  }, [auth])
  
  useEffect(()=>{
    if(!auth.id && allChats[0]){
      // console.log(allChats)
      // window.location.hash = allChats[0].id;
    }
  }, [allChats])
  
  const createMessage =(message)=>{
    api.createMessage(message, setMessages, messages)
    socket.emit('sendingMessage', message)
  }
  
  const registerAccount = (credentials)=> {
    return api.registerAccount({credentials, setAllUsers, users});
    
  }

  const authenticate = async(credentials)=> {
    const response = await api.authenticate({credentials, setAuth}).then(()=>{
    })
    return response
  }

  const updateChat = async(chatId)=>{
    await api.updateChat(chatId, setAllChats, allChats)
  }

  const createChat = async(chatData)=> {
    return await api.createChat(allChats, setAllChats, chatData)
  }

  const logout = ()=> {
    setAuth({})
    window.localStorage.removeItem('token')
    window.location.hash = '#'
  }

  return (
    <div className='bg-backgroundColor h-screen w-screen'>
      {
        auth.username ? <p className='w-full text-center text-white h-[10px]'>{auth.username.toUpperCase()}</p>
        :null
      }
      {
      <div className='h-full flex items-center pl-5 pr-5 gap-5'>
          {
            auth.id ? 
            <div className='w-1/3 border-accentColor border-4 h-[95%] rounded-xl p-3 bg-boxColor flex items-end'>
              
              <Users users={ users } allChats={ allChats } createChat={ createChat } auth={ auth } logout={ logout }/>
            </div>
            : 
            <div className='w-1/3 border-accentColor border-4 h-[95%] rounded-xl p-3 bg-boxColor  overflow-scroll'>
              <div className='flex flex-col gap-20'>
                <Login authenticate={authenticate}/>
                <Register registerAccount={registerAccount}/>
              </div>
            </div>
          }
        <div className='w-2/3 border-accentColor border-4 h-[95%] rounded-xl p-3 bg-boxColor flex justify-end flex-col'>
          <Routes>
            <Route path={`/chat/:id`} element={ <Chat auth={ auth } setMessages={ setMessages } messages={ messages } users={ users } setAllUsers={ setAllUsers } createMessage={ createMessage } allChats={ allChats } updateChat={ updateChat }/> }/>
            <Route path={`/`} element={ <Chat auth={ auth } setMessages={ setMessages } messages={ messages } users={ users } createMessage={ createMessage } allChats={ allChats } updateChat={ updateChat }/> }/>
          </Routes>
        </div>
      </div>
      }
      
    </div>
  );
}

export default App;
