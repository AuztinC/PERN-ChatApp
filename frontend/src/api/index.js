import axios from 'axios';

const getHeaders = ()=> {
  return { headers: {authorization: window.localStorage.getItem('token')}}
}

const registerAccount = async({credentials, setAllUsers, users})=> {
  const response = await axios.post('/api/users', credentials)
  setAllUsers([...users, response.data])
  return response
}

const getAllUsers = async(setUsers)=>{
  const response = await axios.get('api/users')
  setUsers(response.data)
}

const attemptLoginWithToken = async(setAuth)=> {
  const token = window.localStorage.getItem('token');
  if(token){
    try {
      const response = await axios.get('api/users/me', getHeaders());
      // console.log('response', response.data)
      setAuth(response.data);
    }
    catch(ex){
      if(ex.response.status === 401){
        window.localStorage.removeItem('token');
      }
    }
  }
}

const authenticate = async({credentials, setAuth})=> {
  let response = await axios.post('api/users/login', credentials)
  const { token } = response.data
  window.localStorage.setItem("token", token)
  attemptLoginWithToken(setAuth)
}

const getAllMessages = async(setMessages)=>{
  const response = await axios.get('api/messages')
  setMessages(response.data)
}

const createMessage = async(message, setMessages, messages)=>{
  const response = await axios.post('api/messages', message, getHeaders())
  setMessages([...messages, response.data])
}

const getAllChats = async(setAllChats, auth)=>{
    const response = await axios.get(`api/chat/${auth.id}`)
    setAllChats(response.data)
}

const getDefaultChat = async(setAllChats)=> {
  const response = await axios.get(`api/chat`)
  setAllChats(response.data)
}

const updateChat = async(setAllChats, chatId, allChats)=>{
  const response = await axios.put(`/api/chat/${chatId}`)
  setAllChats([...allChats, response.data])
}

const createChat = async( allChats, setAllChats, chatData)=>{
  const response = await axios.post('/api/chat', chatData)
  setAllChats([...allChats, response.data])
  return response.data
}

const api = {
  registerAccount,
  authenticate,
  attemptLoginWithToken,
  getAllMessages,
  getAllUsers,
  createMessage,
  getAllChats,
  updateChat,
  createChat,
  getDefaultChat
}

export default api;