const express = require('express');
const { createMessage, getAllMessages } = require('../db/messages');
const app = express.Router();
const { isLoggedIn } = require('./middleware');

app.get('/', async(req, res, next)=>{
    try {
        res.send(await getAllMessages())
    } catch (error) {
        next(error)
    }
})
app.post('/', isLoggedIn, async(req, res, next)=>{
    try {
        res.send(await createMessage(req.body))
    } catch (error) {
        next(error)
    }
})


module.exports = app