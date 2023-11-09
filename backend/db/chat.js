const client = require("./client")
const { v4: uuidv4 } = require('uuid') 

const getAllChats = async(id) =>{
  SQL = `
  SELECT * FROM chat
  `
  const response = await client.query(SQL)
  const usersChats = response.rows.filter(chat=>chat.users.find(_user=> _user.id === id))
  return usersChats
}

const getDefaultChat = async()=> {
  const SQL = `SELECT * FROM chat WHERE chatName = 'defaultChat'`
  const response = await client.query(SQL)
  return response.rows
}

const createChat = async(body)=>{
	const { user, targetUser } = body
  let response = null;
  if(targetUser){
    response = await client.query(`
    INSERT INTO chat (id, users) 
    VALUES ($1, $2)
    RETURNING *
    `, [uuidv4(), [user, targetUser]])
  } else {
    response = await client.query(`
    INSERT INTO chat (id, users, chatName) 
    VALUES ($1, $2, $3)
    RETURNING *
    `, [uuidv4(), [user], "New Chat"])
  }
	return response.rows[0]
}
const createDefaultChat = async(body)=>{
	const { chatName } = body
	const users = await client.query(`SELECT username, image, id FROM users`)
	let response = await client.query(`
	INSERT INTO chat (id, chatName, users) 
	VALUES ($1, $2, $3)
	RETURNING *
	`, [uuidv4(), chatName, users.rows])
	return response.rows[0]
	
}

const updateChat = async(body) =>{
	const SQL = `
	UPDATE chat 
	SET users = $2
	WHERE id = $1
	`
	const response = await client.query(SQL, [body.id, body.users])
	return response.rows[0]
}

module.exports = {
	createChat,
	getAllChats,
	createDefaultChat,
	updateChat,
  getDefaultChat
}