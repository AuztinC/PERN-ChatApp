const {
  createUser,
  getUsers
} = require('../db/users.js');

const express = require('express');
const app = express.Router();

app.post('/', async(req, res, next)=> {
  try {
    res.send(await createUser(req.body))
  } catch (error) {
    next(error)
  }
})

app.get('/', async(req, res, next)=> {
  try {
    res.send(await getUsers())
  } catch (error) {
    next(error)
  }
})

module.exports = app
