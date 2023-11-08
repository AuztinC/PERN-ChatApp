import React, { useState } from "react";
import { Link } from 'react-router-dom';

const Users = ({ users, allChats })=> {

  return (
    <section className="w-full h-1/2 border-accentColor border-2 p-4 rounded-xl shadow-lg">
      <ul>
        {
          allChats.map(chat => {
            return (
              <li key={chat.id}>
                <Link to={`/chat/${chat.id}`}>{ chat.chatname }</Link>
              </li>
            )
          })
          
        }
      </ul>
    </section>
  )
}

export default Users