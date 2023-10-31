import axios from 'axios';

const getHeaders = ()=> {
  return { headers: {authorization: window.localStorage.getItem('token')}}
}

const registerAccount = async(credentials)=> {
  const response = await axios.post('http://localhost:3001/api/users', credentials)
  console.log(response.data)
}

const getAllUsers = async(setUsers)=>{
  const response = await axios.get('http://localhost:3001/api/users')
  setUsers(response.data)
}

const attemptLoginWithToken = async(setAuth)=> {
  const token = window.localStorage.getItem('token');
  if(token){
    try {
      const response = await axios.get('http://localhost:3001/api/users/me', getHeaders());
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
  let response = await axios.post('http://localhost:3001/api/users/login', credentials)
  const { token } = response.data
  window.localStorage.setItem("token", token)
  attemptLoginWithToken(setAuth)
}

const getAllMessages = async(setMessages)=>{
  const response = await axios.get('http://localhost:3001/api/messages')
  setMessages(response.data)
}

const createMessage = async(message, setMessages, messages)=>{
  const response = await axios.post('http://localhost:3001/api/messages', message, getHeaders())
  setMessages([...messages, response.data])
}



const api = {
  registerAccount,
  authenticate,
  attemptLoginWithToken,
  getAllMessages,
  getAllUsers,
  createMessage
}

export default api;