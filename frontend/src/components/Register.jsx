import React, { useState, useEffect, useRef } from "react";

const Register = ({registerAccount, showRegister})=> {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('')
  
  const regBox = useRef();
  
  
  const register = async(ev)=> {
    ev.preventDefault();
    try {
      const credentials = { username: username, password: password}
      await registerAccount(credentials)
      setPassword('')
      setUsername('')
    } catch (error) {
      console.log(error)
      setError(error.response.data.message)
    }
  }
  
  useEffect(()=>{
    if( showRegister && regBox ) {
      regBox.current.classList.remove("animate-shrink")
      regBox.current.classList.add("animate-grow")
      regBox.current.style.maxHeight = "25vh"
      regBox.current.style.overflowY = "scroll"
      regBox.current.style.opacity = "1"
    } else if ( !showRegister && regBox ) {
      regBox.current.classList.remove("animate-grow")
      regBox.current.classList.add("animate-shrink")
      regBox.current.style.maxHeight = "0px"
      regBox.current.style.overflow = "hidden"
      regBox.current.style.opacity = "0"
    }
  }, [ showRegister ])

  return (
    <div ref={regBox} className="w-full m-h-[40vh] border-accentColor border-2 p-4 rounded-xl shadow-lg overflow-hidden transition:opacity">
      <h1 className="text-6xl font-extrabold text-center mb-5 ">Register</h1>
      <form onSubmit={register} className="flex flex-col gap-2 items-center">
        <label className="flex w-full gap-5 justify-center flex-col md:flex-row md:gap-5">
          <h1 className="w-20 text-xl">Username:</h1>
          <input className="border-black border-2 pl-1 rounded-md" value={username} type="text" onChange={(ev)=> {setUsername(ev.target.value)}}/>
        </label>
        <label className="flex w-full gap-5 justify-center flex-col md:flex-row md:gap-5">
          <h1 className="w-20 text-xl">Password:</h1>
          <input className="border-black border-2 pl-1 rounded-md" value={password} type="text" onChange={(ev)=> {setPassword(ev.target.value)}}/>
        </label>
        <button className="border-black border-2 w-2/3" type='submit'>Create Account</button>
      </form>
    { error ? error : null}
    </div>
  )
}

export default Register