import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

const Users = ({ users, allChats, createChat, auth, logout })=> {
  const [filteredUsers, setfilteredUsers] = useState([])
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)
  const [targetUser, setTargetUser] = useState('')
  const nav = useNavigate()
  
  const createRoom = async()=> {
    const chatId = await createChat( {user: auth} )
    nav(`/chat/${chatId.id}`)
  }

  const createDM = async()=> {
    const chatId = await createChat({targetUser, user: auth})
    nav(`/chat/${chatId.id}`)
    setTargetUser('')
    setInput('')
  }

  useEffect(()=>{
    if(!open){
      setTargetUser('')
      setInput('')
    }
  }, [open])

  useEffect(()=>{
    if(users && input !== ''){
      setfilteredUsers(users.filter(user=>user.username.includes(input) && user.username !== auth.username))
    }
  }, [auth.username, input, users])
  
  return (
    <section className="w-full h-full overflow-hidden">
      <div className="flex justify-between border-b-2 border-accentColor mb-2">
        <button onClick={ logout }>Logout</button>
        <button onClick={()=> {setOpen(!open)}}>Direct Message</button>
        <button onClick={()=> {createRoom()} }>Create new room</button>
      </div> 
      {
        open ? 
      <div className="">
        <input type="text" value={ input } onChange={(ev) => setInput(ev.target.value) }/>
        <button onClick={ createDM } hidden={ !targetUser }>Create</button>
      </div>
      : null
      }
      <ul className="overflow-y-scroll h-[95%]">
        { input === ''?
          allChats.map(chat => {
            return (
              <li key={chat.id}>
                <Link to={`/chat/${chat.id}`}>{ chat.chatname ? chat.chatname : chat.users.filter(user => user.username !== auth.username).map(user =>  user.username)}</Link>
              </li>
            )
          }):
          filteredUsers.map(_user => {
            return (
              <li key={_user.id}>
                 <button className={`${targetUser.username === _user.username ? 'bg-yellow-300' : ''}`} onClick={()=> setTargetUser(_user)}>{ _user.username }</button>
              </li>
            )
          })
        }
      </ul>
    </section>
  )
}

export default Users