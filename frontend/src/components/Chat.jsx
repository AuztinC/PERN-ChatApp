import React, { useEffect, useState, useRef } from 'react'

function Chat({ auth, messages, users, createMessage }) {
    const [message, setMessage] = useState('')
    const dummy = useRef()
    const chatRef = useRef()

    useEffect(()=> {
      dummy.current.scrollIntoView({block: "end", inline: "end", behavior: "instant"})
    }, [messages])

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
      <div className='overflow-y-scroll  max-h-[87vh]' id='chatBox' ref={ chatRef }>
        { messages.length > 0 && users.length > 0 ? 
          messages.map(_message=>{
            const userMessage = users.find(user=>user.id === _message.userid)
            return (
            <div  key={_message.id} className={`w-full flex my-3 ${ userMessage.id === auth.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`w-fit p-2 rounded-xl flex ${ userMessage.id === auth.id ? 'bg-sendColor' : 'bg-receivedColor'}`}>
                <span className='font-bold'>{ userMessage.username }</span>: { _message.message }
              </div>
            </div>
            )
          }): null
        }
        <div ref={ dummy }></div>
      </div>
      {
        auth.id ? 
        <form onSubmit={ submit } className='flex justify-center h-10'>
          <input className='w-full pl-2' type='text' placeholder='message' value={message} onChange={(ev)=>setMessage(ev.target.value)}/>
          <button className='border-accentColor border-2 px-2 hover:bg-accentColor'>Send</button>
        </form>
        : null
      }
    </div>
  )
}

export default Chat