const express = require('express')
const func3 = require('../controllers/movie-controllers')

const movieRouter = express.Router()

movieRouter.get('/', func3.getAllMovies)
movieRouter.get("/:id",func3.getMovieById);
movieRouter.post('/',func3.addMovie)

module.exports = movieRouter