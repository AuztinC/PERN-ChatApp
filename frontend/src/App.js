import React, { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import api from './api';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';
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
    api.registerAccount(credentials);
  }

  const authenticate = (credentials)=> {
    api.authenticate({credentials, setAuth});
  }

  const logout = ()=> {
    setAuth({})
    window.localStorage.removeItem('token')
  }

  return (
    <>
      {
        !auth.username ? 
        <>
          <Register registerAccount={registerAccount}/>
          <Login authenticate={authenticate}/>
        </>
        : <>
          <button onClick={ logout }>Logout</button>
          <div>
            <Chat auth={ auth } messages={ messages } users={ users } createMessage={ createMessage }/>
          </div>
        </>
      }
    </>
  );
}

export default App;
