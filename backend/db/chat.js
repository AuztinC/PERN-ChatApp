const client = require("./client")
const { v4: uuidv4 } = require('uuid') 


const getAllChats = async(id) =>{
	const SQL = `
        SELECT * FROM chat
        `
	const response = await client.query(SQL)
	const usersChats = response.rows.filter(chat=>chat.users.find(_user=>_user.id === id))
	return usersChats
}


const createChat = async(body)=>{
	const { chatName, userId, targetId, last_sent_userId } = body
	const user = await client.query(`SELECT username, image, id FROM users WHERE id='${userId}'`)
	let response = await client.query(`
	INSERT INTO chat (id, chatName, last_sent_userId, users) 
	VALUES ($1, $2, $3, $4)
	RETURNING *
	`, [uuidv4(), chatName, last_sent_userId, [user.rows[0]]])
	return response.rows[0]
	
}
const createDefaultChat = async(body)=>{
	const { chatName, userId, last_sent_userId } = body
	const users = await client.query(`SELECT username, image, id FROM users`)
	let response = await client.query(`
	INSERT INTO chat (id, chatName, last_sent_userId, users) 
	VALUES ($1, $2, $3, $4)
	RETURNING *
	`, [uuidv4(), chatName, last_sent_userId, users.rows])
	return response.rows[0]
	
}

const updateChat = async(body) =>{
	console.log(body)
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
	updateChat
}