const app = require('.');
const { findUserByToken } = require('../db/users');

const isLoggedIn = async(req, res, next)=> {
  try {
    const user = await findUserByToken(req.headers.authorization);
    req.user = user;
    next();
  }
  catch(ex){
    next(ex);
  }
};




module.exports = {
    isLoggedIn
}