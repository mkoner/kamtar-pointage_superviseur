const jwt = require('jsonwebtoken')
const AppUser = require('../models/app-user.model')
const AppUserController = require('../controllers/app-user.controller')

const protect =  async(req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from the token
      
      req.user  = await AppUser.getUserByID1(decoded.id)
    

      next()
    } catch (error) {
      console.log(error)
      res.status(401)
      throw new Error('Not authorized')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
}

module.exports = { protect }