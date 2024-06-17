import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import RedX from "../styledComponents/RedX";

const Users = ({ users, allChats, createChat, auth, logout })=> {
  const  location  = useLocation()
  const [filteredUsers, setfilteredUsers] = useState([])
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)
  const [targetUser, setTargetUser] = useState('')
  const [selectedChat, setSelectedChat] = useState(null)
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
  
  useEffect(()=>{
    let id = location.pathname.slice(6)
    setSelectedChat(allChats.find(chat=>chat.id === id))
  }, [location, auth.username, users])
  
  
  return (
    <section className="w-full h-full overflow-scroll">
      <div className="bg-boxColor flex justify-between border-b-2 border-accentColor mb-2 sticky top-0">
        <button className="underline decoration-red-300/30 hover:decoration-red-300/100 transition duration-300 delay-150" onClick={ logout }>Logout</button>
        <button className="underline decoration-black/30 hover:decoration-teal-300/100 transition duration-300 delay-150" onClick={()=> {setOpen(!open)}}>Direct Message</button>
        <button className="underline decoration-black/30 hover:decoration-teal-300/100 transition duration-300 delay-150 " onClick={()=> {createRoom()} }>Create new room</button>
      </div> 
      {
        open ? 
      <div className="">
        <input type="text" value={ input } onChange={(ev) => setInput(ev.target.value) }/>
        <button onClick={ ()=>setOpen(!open) } className="pr-5">
          <RedX />
        </button>
        <button onClick={ createDM } hidden={ !targetUser }>Create</button>
      </div>
      : null
      }
      <ul className="overflow-y-scroll h-[95%]">
        { input === ''?
          allChats.map(chat => {
            return (
              <li key={chat.id} className={`${ selectedChat?.id === chat.id ? "bg-red-100 capitalize font-bold" : "capitalize" }`}>
                <Link to={`/chat/${chat.id}`}>{ chat.chatname ? chat.chatname : chat.users.filter(user => user.username !== auth.username).map(user =>  user.username)}</Link>
              </li>
            )
          }):
          filteredUsers.map(_user => {
            return (
              <li key={_user.id} className="capitalize">
                 <button className={`${targetUser.username === _user.username ? 'capitalize bg-yellow-300' : 'capitalize'}`} onClick={()=> setTargetUser(_user)}>{ _user.username }</button>
              </li>
            )
          })
        }
      </ul>
    </section>
  )
}

export default Users