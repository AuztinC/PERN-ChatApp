const client = require("./client")
const { v4: uuidv4 } = require('uuid') 

const createMessage = async(messageData)=>{
    try {
        const SQL = `
        INSERT INTO messages(id, userId, message, chatId) VALUES($1, $2, $3, $4) RETURNING *
        `;
        const response = await client.query(SQL, [uuidv4(), messageData.userid, messageData.message, messageData.chatid])
        return response.rows[0]
    } catch (error) {
        console.log(error)
    }
    
}

const getAllMessages = async()=>{
    try {
        const response = await client.query( SQL = `SELECT * FROM messages` )
        return response.rows
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    createMessage,
    getAllMessages
}