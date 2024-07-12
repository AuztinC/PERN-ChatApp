import React, { useState, useEffect, useRef } from 'react';
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
  const [showRegister, setShowRegister] = useState(false)
  const newRegArrow = useRef();
  // const regBox = useRef();
  
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
    // api.getDefaultChat(setAllChats)
    api.getAllMessages(setMessages)
    api.getAllUsers(setAllUsers)
  }, [])
  
  useEffect(()=>{
    if(!auth.id){
      api.getDefaultChat(setAllChats)
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
  // useEffect(()=>{
  //   console.log(showRegister)
  // }, [showRegister])
  
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
  
  function handleShowRegister(click){
    setShowRegister(!showRegister)
  }
  useEffect(()=>{
    // console.log(newRegArrow.current)
    if(showRegister && newRegArrow) {
      newRegArrow.current.classList.remove("animate-rotateUp")
      newRegArrow.current.classList.add("animate-rotateDown")
      newRegArrow.current.style.transform = 'rotate(0)'
      
      // regBox.current.classList.remove("animate-shrink")
      // regBox.current.classList.add("animate-grow")
      
    } else if (!showRegister && newRegArrow) {
      newRegArrow.current.classList.remove("animate-rotateDown")
      newRegArrow.current.classList.add("animate-rotateUp")
      newRegArrow.current.style.transform = 'rotate(180deg)'
      
      // regBox.current.classList.remove("animate-grow")
      // regBox.current.classList.add("animate-shrink")
    } 
  }, [showRegister])

  return (
    <div className='bg-backgroundColor h-screen w-screen'>
      {
        auth.username ? <p className='w-full text-center text-white h-[10px]'>{auth.username.toUpperCase()}</p>
        :null
      }
      {
      <div className='h-full flex flex-col md:flex-row items-center pt-5 md:mt-0 px-5 gap-5'>
          {
            auth.id ? 
            <div className='w-[100%] md:w-1/3 border-accentColor border-4 h-[20vh] md:h-[95%] rounded-xl p-3 bg-boxColor flex items-end'>
              
              <Users users={ users } allChats={ allChats } createChat={ createChat } auth={ auth } logout={ logout }/>
            </div>
            : 
            <div className='w-[100%] border-accentColor border-4 h-[95%] rounded-xl p-3 bg-boxColor  overflow-scroll'>
              <div className='flex flex-col gap-5'>
                <Login authenticate={authenticate}/>
                  <span className='w-[fit-content] text-red-600 underline hover:cursor-pointer ' onClick={handleShowRegister}>
                    New User? Register Here 
                      <svg ref={newRegArrow} className='h-[10px] inline px-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 129 129">
                        <path d="M121.3 34.6c-1.6-1.6-4.2-1.6-5.8 0l-51 51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8 0-1.6 1.6-1.6 4.2 0 5.8l53.9 53.9c.8.8 1.8 1.2 2.9 1.2 1 0 2.1-.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2.1-5.8z"></path>
                      </svg>
                  </span>
                    <Register showRegister={showRegister} registerAccount={registerAccount}/>
              </div>
            </div>
          }
        <div className='w-[100%] md:w-2/3 border-accentColor border-4 h-[70%] md:h-[95%] rounded-xl p-3 bg-boxColor flex justify-end flex-col'>
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
