const express = require('express')
const func = require("../controllers/user-controllers");

const userRouter = express.Router()

userRouter.get("/", func.getAllUsers) 
userRouter.post('/signup', func.addUser)
userRouter.put('/:id', func.updateUser)
userRouter.delete("/:id", func.deleteUser)
userRouter.post('/login', func.login)
userRouter.get("/bookings/:id", func.getBookingsOfUser)
userRouter.get('/:id',func.getUserDetail)

module.exports = userRouter