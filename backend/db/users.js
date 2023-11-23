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
  const users = await client.query(`SELECT * FROM users`)
  if(users.rows.find(_user=>_user.username === user.username)){
    const error = Error('Username Already Exists');
    error.status = 401;
    throw error;
  }
  user.password = await bcrypt.hash(user.password, 5);
  let SQL = `
  INSERT INTO users(id, username, password, image) VALUES($1, $2, $3, $4) RETURNING id, username;
  `
  const response = await client.query(SQL, [uuidv4(), user.username, user.password, user.image])
  const newUser = await client.query(`SELECT id, username, image FROM users where id = '${response.rows[0].id}'`)
  const defaultChat = await client.query(`SELECT users, id FROM chat WHERE chatName = 'defaultChat'`)
  // console.log(user)
  if(!defaultChat.rows[0].users.length){
    SQL = `
    UPDATE chat 
    SET users = $2
    WHERE id = $1
    `
    await client.query(SQL, [defaultChat.rows[0].id, [newUser.rows[0]]])
  } else {
    SQL = `
    UPDATE chat 
    SET users = $2
    WHERE id = $1
    `
    await client.query(SQL, [defaultChat.rows[0].id, [...defaultChat.rows[0].users, newUser.rows[0]]])
  }

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