const express = require('express');
const app = express.Router();
app.use(express.json())

app.use('/users', require('./users'))

module.exports = app