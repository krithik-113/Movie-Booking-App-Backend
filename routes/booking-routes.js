const express = require('express')
const book = require('../controllers/booking-controllers')

const bookingsRouter = express.Router()

bookingsRouter.post('/', book.newBooking)
bookingsRouter.get('/:id', book.getBookingById)
bookingsRouter.delete("/:id",book.deleteBooking)

module.exports = bookingsRouter