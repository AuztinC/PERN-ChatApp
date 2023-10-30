const { v4: uuidv4 } = require('uuid');
const client = require('./client')

const createUser = async(user)=> {
  const SQL = `
  INSERT INTO users(id, name) VALUES($1, $2) RETURNING *;
  `
  const response = await client.query(SQL, [uuidv4(), user.name])
  return response.rows[0]
}

const getUsers = async()=> {
  const SQL = `
  SELECT * FROM users;
  `
  const response = await client.query(SQL)
  return response.rows
}

module.exports = {
  createUser,
  getUsers
}