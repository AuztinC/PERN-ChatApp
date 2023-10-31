import React, { useState } from "react";

const Login = ({authenticate})=> {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = (ev)=> {
    ev.preventDefault();
    const credentials = { username, password}
    authenticate(credentials)
  }

  return (
    <section>
      <form onSubmit={login}>
        <label>Username: <input value={username} type="text" onChange={(ev)=> {setUsername(ev.target.value)}}/></label>
        <label>Password: <input value={password} type="text" onChange={(ev)=> {setPassword(ev.target.value)}}/></label>
        <button type='submit'>Login</button>
      </form>
    </section>
  )
}

export default Login