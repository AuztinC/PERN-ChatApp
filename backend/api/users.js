const {
  createUser,
  getUsers,
  authenticate,
  findUserByToken
} = require('../db/users.js');

const express = require('express');
const app = express.Router();

app.get('/me', async(req, res, next)=> {
  try {
    res.send(await findUserByToken(req.headers.authorization))
  } catch (error) {
    next(error)
  }
})

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

app.post('/login', async(req, res, next)=> {
  try {
    const token = await authenticate(req.body);
    res.send({ token });
  }
  catch(ex){
    next(ex);
  }
});

module.exports = app
