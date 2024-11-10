const express = require('express')
const func1 = require('../controllers/admin-controllers')

const adminRouter = express.Router()

adminRouter.post('/signup', func1.addAdmin)
adminRouter.post('/login', func1.adminLogin)
adminRouter.get('/', func1.getAdmins)
adminRouter.get('/:id',func1.getAdminById)

module.exports = adminRouter