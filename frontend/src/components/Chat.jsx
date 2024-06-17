import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { socket } from '../socket'
import Picker from 'emoji-picker-react'
import { BsEmojiSmileFill } from 'react-icons/bs'
import { IconContext } from "react-icons";
import BouncingDotsAnimation from './BouncingDotsAnimation'





function Chat({ auth, messages, setMessages, users, createMessage, allChats, setAllUsers }) {
    const { id } = useParams()
    let currChat = null
    let currentChatMessages = null
    const [message, setMessage] = useState('')
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [typer, setTyper] = useState({});
    const [displayChat, setDisplayChat] = useState(false);
    const dummy = useRef()
    const chatRef = useRef(null)
    const incMessageRef = useRef(null)
    
    
    
    
    

    useEffect(()=> {
      // console.log(incMessageRef.current)
      if(incMessageRef.current?.chatid === id && dummy.current || currChat && !id && incMessageRef.current?.chatid === currChat?.id){
        setTimeout(dummy.current.scrollIntoView({block: "end", inline: "end", behavior: "smooth"}), 1000)
        currentChatMessages = messages.filter(_message=>_message.chatid === currChat.id)
      } else {
        // console.log("message not received")
        // set new notification
      }
    }, [messages])
    
    useEffect(()=>{
      if(message != "" && currChat){
        socket.emit("userTyping", {username: auth.username, chatId: currChat.id})
      } else if (message === ""){
        socket.emit("userStopTyping", {username: auth.username})
      }
    }, [message])
    
    useEffect(()=>{
      // console.log("id change")
      if(id){
        setDisplayChat(true);
      } else {
        // setDisplayChat(false)
      }
      if(id && dummy.current){
      dummy.current.scrollIntoView({block: "end", inline: "end", behavior: "smooth"})
      } 

    }, [id])
    
    useEffect(()=>{
      
      if(!id && allChats.length > 0){
        currChat = allChats.find(chat=>chat.chatname === "Lobby")
        if(currChat){
          currentChatMessages = messages.filter(_message=>currChat.id === _message.chatid)
        }
      } else if(auth.id && id && allChats.length > 1) {
        currChat = allChats.find(chat=>chat.id === id)
        if(!currChat){
          console.log(currChat)
          return 'loading chat...';
        }
        currentChatMessages = messages.filter(_message=>_message.chatid === currChat.id)
      }
    }, [allChats])
    
    
    if(!id && allChats.length > 0){
      currChat = allChats.find(chat=>chat.chatname === "Lobby")
      if(currChat){
        currentChatMessages = messages.filter(_message=>currChat.id === _message.chatid)
      }
    } else if(auth.id && id && allChats.length > 1) {
      currChat = allChats.find(chat=>chat.id === id)
      if(!currChat){
        console.log(currChat)
        return 'loading chat...';
      }
      currentChatMessages = messages.filter(_message=>_message.chatid === currChat.id)
    }
    
    
    socket.on('receiveMessage', newMessage=>{
      setMessages([...messages, newMessage])
      incMessageRef.current = newMessage;
      
      // if (!users.find(user=>user.id === newMessage.userid)) {
        
      // }
      
    })
    
    socket.on("userTyping", chatInfo=>{
      if(!typer.username){
        setTyper(chatInfo)
        
      }
    })
    socket.on("userStopTyping", chatInfo=>{
        setTyper({})
        
    })
    
    
    
    function handleEmojiWindow(value){
      // setShowEmojiPicker(!showEmojiPicker)
      setShowEmojiPicker(value)
    }
    
    function handleEmoji(emoji){
      let msg = message;
      msg += emoji.emoji
      setMessage(msg)
    }
    
    function submit(ev){
      ev.preventDefault()
      const newMessage = {
        userid: auth.id,
        chatid: currChat.id,
        message
      }
      createMessage(newMessage)
      setMessage('')
      incMessageRef.current = newMessage
    }
    
    if(!users || !messages || !currentChatMessages){
      // console.log("somethings null")
      return null
    }
  return (
    <div>
      <div className='relative overflow-y-scroll  max-h-[87vh]' id='chatBox' ref={ chatRef }>
        {
          currChat.isgroup ? 
          <button className='absolute top-0 left-0'>Add people</button> // add new people to your group chat
          : null
        }
        { currentChatMessages.length > 0 && users.length > 0 ? 
          currentChatMessages.map((_message, i)=>{
            const userMessage = users.find(user=>user.id === _message.userid)
            
            return (
            <div  key={i} className={`w-full flex my-3 ${ userMessage.id === auth.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`w-fit p-2 rounded-xl flex ${ userMessage.id === auth.id ? 'bg-sendColor' : 'bg-receivedColor'}`}>
                <span className='font-bold'>{ userMessage.username }</span>: { _message.message }
              </div>
            </div>
            )
          }): null
        }
        {/* Check for user typing, display bubbles */}
        {
          currChat.id === typer.chatId ? 
          <BouncingDotsAnimation typer={typer}/>
          :null
        }
        {/* dummy ref for scrolling */}
        <div ref={ dummy }></div>
      </div>
      {/* Check if logged in, display input form */}
      {
        auth.id && displayChat ? 
        <form onSubmit={ submit } className='flex justify-center h-10'>
          <div className='relative border-2 border-transparent p-0.5 mr-5 rounded-[50%] bg-black flex items-center pointer-events-hand hover:border-accentColor transition ease-in-out delay-150' onClick={()=>handleEmojiWindow(true)} onMouseLeave={()=>handleEmojiWindow(false)}>
            <IconContext.Provider value={{ color: "#ffff00c8", size: "2em" }}>
              <div>
                <BsEmojiSmileFill />
              </div>
            </IconContext.Provider>
            {
              showEmojiPicker ? 
              <div className='absolute -top-[455px] border-black border-2'>
                <Picker onEmojiClick={handleEmoji}/>
              </div>
              :null
            }
          </div>
          <input className='w-full pl-2 focus:border-accentColor' type='text' placeholder='message' value={message} onChange={(ev)=>setMessage(ev.target.value)}/>
          <button className='border-accentColor border-2 px-2 hover:bg-accentColor'>Send</button>
        </form>
        : null
      }
    </div>
  )
}

export default Chat