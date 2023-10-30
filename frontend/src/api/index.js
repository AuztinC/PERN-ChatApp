import axios from 'axios';

const getHeaders = ()=> {
  return { headers: {authorization: window.localStorage.getItem('token')}}
}

const registerAccount = async(credentials)=> {
  const response = await axios.post('http://localhost:3001/api/users', credentials)
  console.log(response.data)
}

const authenticate = async({credentials, setAuth})=> {
  let response = await axios.post('http://localhost:3001/api/users/login', credentials)
  const { token } = response.data
  window.localStorage.setItem("token", token)
  response = await axios.get('http://localhost:3001/api/users/me', getHeaders())
  setAuth(response.data);
}

const api = {
  registerAccount,
  authenticate
}

export default api;