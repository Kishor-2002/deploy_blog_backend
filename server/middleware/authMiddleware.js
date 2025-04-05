const jwt = require('jsonwebtoken')
const User = require('../models/user')
const jwtSecret = "BLOGUSINGMERN";

const authMiddleware = async (req, res, next ) => {
   const token = req.cookies.token;

  if(!token) {
    return res.status(401).json( { message: 'Unauthorized'} );
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch(error) {
    res.status(401).json( { message: 'Unauthorized'} );
  }
}

module.exports = authMiddleware