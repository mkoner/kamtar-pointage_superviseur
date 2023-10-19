const jwt = require('jsonwebtoken')
const AppUser = require('../models/app-user.model')
const asyncHandler = require('express-async-handler')

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Kamtar')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from the token
      
      req.user = await AppUser.getUserByID(decoded.id)

      next()
    } catch (error) {
      console.log(error)
      res.status(401)
      throw new Error('Not authorized')
    }
  }

  if (!token) {
    console.log("No token passed")
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

module.exports = { protect }