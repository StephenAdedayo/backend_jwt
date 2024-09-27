const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
require('dotenv').config()

const protect = async (req, res, next) => {
    let token;
  
    // Check if the Authorization header is present and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        // Extract token from the Authorization header
        token = req.headers.authorization.split(" ")[1];
  
        // Verify the token using JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
        // Find the user by ID and exclude the password field
        req.user = await User.findById(decoded.id).select('-password');
  
        // Check if the user exists
        if (!req.user) {
          return res.status(401).json({
            message: 'Not authorized, user not found',
            status: 'failed',
            error: 'Invalid token'
          });
        }
  
        // Proceed to the next middleware if everything is fine
        next();
  
      } catch (error) {
        return res.status(401).json({
          message: 'Not authorized, invalid token',
          status: 'failed',
          error: error.message
        });
      }
    } else {
      // If no token is provided, send an error response
      return res.status(401).json({
        message: 'Not authorized, no token provided',
        status: 'failed',
        error: 'Token missing'
      });
    }
  };

const admin = (req, res, next) => {
    if(req.user && req.user.isAdmin){
        next()
    } else{
  return res.status(403).json({message : 'not authorised as an admin'})

    }
}

module.exports = { protect, admin }