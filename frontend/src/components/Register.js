import React, { useState } from "react";

const Register = ({registerAccount})=> {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const register = (ev)=> {
    ev.preventDefault();
    const credentials = { username: username, password: password}
    registerAccount(credentials)
  }

  return (
    <section>
      <form onSubmit={register}>
        <label>Username: <input value={username} type="text" onChange={(ev)=> {setUsername(ev.target.value)}}/></label>
        <label>Password: <input value={password} type="text" onChange={(ev)=> {setPassword(ev.target.value)}}/></label>
        <button type='submit'>Create Account</button>
      </form>
    </section>
  )
}

export default Register