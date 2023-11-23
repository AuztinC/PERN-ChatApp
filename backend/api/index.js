const express = require('express');
const app = express.Router();
app.use(express.json())

app.use('/users', require('./users'))
app.use('/messages', require('./messages'))
app.use('/chat', require('./chat'))

app.use((err, req, res, next)=>{
  console.log(err)
  res.status(err.status || 500).send({ error: err, message: err.message });
})

module.exports = app