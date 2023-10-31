import React, { useState } from 'react'
import DefaultButton from '../styledComponents/Button'

function Chat({ auth, messages, users, createMessage }) {
    const [message, setMessage] = useState('')
    
    function submit(ev){
      ev.preventDefault()
      const newMessage = {
        userId: auth.id,
        message
      }
      createMessage(newMessage)
      setMessage('')
    }
    if(!users || !messages){
      return null
    }
  return (
    <div>
      <div id='chatBox'>
        { messages.length > 0 && users.length > 0 ? 
          messages.map(_message=>{
            const userMessage = users.find(user=>user.id === _message.userid)
            return (
            <div key={_message.id}>
              <div>{ userMessage.username }</div>
              <div>{ _message.message }</div>
            </div>
            )
          }): null
        }
      </div>
        <form onSubmit={ submit }>
            <input type='text' placeholder='message' value={message} onChange={(ev)=>setMessage(ev.target.value)}/>
            <DefaultButton>CHAT</DefaultButton>
        </form>
    </div>
  )
}

export default Chat