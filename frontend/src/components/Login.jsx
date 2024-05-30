import React, { useState } from "react";

const Login = ({authenticate})=> {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('')

  const login = async(ev)=> {
    try {
      ev.preventDefault();
      const credentials = { username, password}
      await authenticate(credentials)
      
      window.location.hash = '#'
      
    } catch (error) {
      setError(error.response.data.message)
    }
  }

  return (
    <section className="w-full h-1/2 border-accentColor border-2 p-4 rounded-xl shadow-lg">
      <h1 className="text-6xl font-extrabold text-center mb-5">Login</h1>
      <form onSubmit={login} className="flex flex-col gap-2 items-center">
        <label className="flex w-full gap-5 justify-center"><h1 className="w-20 text-xl">Username:</h1><input className="border-black border-2 pl-1 rounded-md" value={username} type="text" onChange={(ev)=> {setUsername(ev.target.value)}}/></label>
        <label className="flex w-full gap-5 justify-center"><h1 className="w-20 text-xl">Password:</h1><input className="border-black border-2 pl-1 rounded-md" value={password} type="password" onChange={(ev)=> {setPassword(ev.target.value)}}/></label>
        <button className="border-black border-2 w-2/3" type='submit'>Login</button>
      </form>
      {error ? error : null}
    </section>
  )
}

export default Login