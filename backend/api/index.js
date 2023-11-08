const express = require('express');
const app = express.Router();
app.use(express.json())

app.use('/users', require('./users'))
app.use('/messages', require('./messages'))
app.use('/chat', require('./chat'))

module.exports = app