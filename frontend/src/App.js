import Register from './components/Register.js';
import api from './api';
import Login from './components/Login.js';
import React, { useState, useEffect } from 'react';

function App() {
  const [auth, setAuth] = useState({})

  useEffect(()=> {
    console.log(auth)
  }, [auth])

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
        : <button onClick={logout}>Logout</button>
      }
    </>
  );
}

export default App;
