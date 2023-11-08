const express = require('express');
const { client } = require('../server');
const app = express.Router();

const { createChat, getAllChats, updateChat } = require('../db/chat.js')

app.get('/:id', async(req, res, next)=>{
    try {
        res.send(await getAllChats(req.params.id))
    } catch (error) {
        next(error)
    }
})

app.post('/', async(req, res, next)=>{
    try {
        res.send(await createChat(req.body))
    } catch (error) {
        next(error)
    }
})

app.put('/:id', async(req, res, next)=>{
    try {
        res.send(await updateChat([req.body, req.params.id]))
    } catch (error) {
        next(error)
    }
})

module.exports = app