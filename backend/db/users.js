const { v4: uuidv4 } = require('uuid');
const client = require('./client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const findUserByToken = async(token)=> {
  try {
    const payload = await jwt.verify(token, process.env.JWT);
    const SQL = `
    SELECT id, username, image
    FROM users
    WHERE id = $1;
    `;
    const response = await client.query(SQL, [payload.id])
    if(!response.rows.length){
    const error = Error('bad credentials')
    error.status = 401;
    throw error
    }
    return response.rows[0]
  } catch (error) {
    console.log(error)
  }
}

const authenticate = async(credentials)=> {
  const SQL = `
  SELECT id, password 
  FROM users 
  WHERE username = $1;
  `
  const response = await client.query(SQL, [credentials.username]);
  if(!response.rows.length){
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
  const valid = await bcrypt.compare(credentials.password, response.rows[0].password);
  if(!valid){
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }

  return jwt.sign({ id: response.rows[0].id }, process.env.JWT);
}

const createUser = async(user)=> {
  if(!user.username.trim() || !user.password.trim()){
    throw Error('must have username and password');
  }
  user.password = await bcrypt.hash(user.password, 5);
  const SQL = `
  INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING id, username;
  `
  const response = await client.query(SQL, [uuidv4(), user.username, user.password])
  // await createUsersChats(user.id)
  return response.rows[0]
}

const getUsers = async()=> {
  const SQL = `
  SELECT id, username, image FROM users;
  `
  const response = await client.query(SQL)
  return response.rows
}

module.exports = {
  createUser,
  getUsers,
  authenticate,
  findUserByToken
}