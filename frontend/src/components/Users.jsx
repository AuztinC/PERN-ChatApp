import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

const Users = ({ users, allChats })=> {
  const [filteredUsers, setfilteredUsers] = useState([])
  const [input, setInput] = useState('')
  
  
  useEffect(()=>{
    if(users && input !== ''){
      setfilteredUsers(users.filter(user=>user.username.includes(input)))
    }
  }, [input, users])
  
  useEffect(() => {
    
    // console.log(filteredUsers)
    
  }, [filteredUsers])
  
  return (
    <section className="w-full h-1/2 border-accentColor border-2 p-4 rounded-xl shadow-lg">
      <input type="text" value={ input } onChange={(ev) => setInput(ev.target.value) }/>
      <ul>
        { filteredUsers.length === 0 ?
          allChats.map(chat => {
            return (
              <li key={chat.id}>
                <Link to={`/chat/${chat.id}`}>{ chat.chatname }</Link>
              </li>
            )
          }):
          filteredUsers.map(_user => {
            console.log(_user)
            return (
              <li key={_user.id}>
                 { _user.username }
              </li>
            )
          })
        }
      </ul>
    </section>
  )
}

export default Users