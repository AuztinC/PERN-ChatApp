import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import api from './api';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';
import Users from './components/Users'
const socket = io("http://localhost:3001/")
function App() {
  const [auth, setAuth] = useState({})
  const [messages, setMessages] = useState({})
  const [users, setAllUsers] = useState({})
  
  const attemptLoginWithToken = () =>{
    api.attemptLoginWithToken(setAuth)
  }

  useEffect(()=> {
    attemptLoginWithToken()
    api.getAllMessages(setMessages)
    api.getAllUsers(setAllUsers)
  }, [])
  
  const createMessage =(message)=>{
    api.createMessage(message, setMessages, messages)
  }
  
  const registerAccount = (credentials)=> {
    api.registerAccount({credentials, setAllUsers, users});
  }

  const authenticate = (credentials)=> {
    api.authenticate({credentials, setAuth});
  }

  const logout = ()=> {
    setAuth({})
    window.localStorage.removeItem('token')
  }

  return (
    <div className='bg-backgroundColor h-screen w-screen'>
      {
      <div className='h-full flex items-center pl-5 pr-5 gap-5'>

          {
            auth.id ? 
            <div className='w-1/3 border-accentColor border-4 h-[95%] rounded-xl p-3 bg-boxColor flex items-end'>
              <Users user={ users }/>
              <button className='border-accentColor border-2 p-1 h-fit' onClick={ logout }>Logout</button>
            </div>
            : 
            <div className='w-1/3 border-accentColor border-4 h-[95%] rounded-xl p-3 bg-boxColor'>
              <div className='flex flex-col gap-20'>
                <Login authenticate={authenticate}/>
                <Register registerAccount={registerAccount}/>
              </div>
            </div>
          }
        <div className='w-2/3 border-accentColor border-4 h-[95%] rounded-xl p-3 bg-boxColor flex justify-end flex-col'>
          <Chat auth={ auth } messages={ messages } users={ users } createMessage={ createMessage }/>
        </div>
      </div>
      }
    </div>
  );
}

export default App;
