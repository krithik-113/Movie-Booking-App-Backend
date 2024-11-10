const mongoose = require("mongoose");
const Admin = require('../models/Admin')
const Movie = require("../models/Movie");
const jwt = require("jsonwebtoken");

const addMovie = async (req, res, next) => {
  const extractedToken = req.headers.authorization.split(" ")[1];
  if (!extractedToken && extractedToken.trim() === "") {
    return res.status(404).json({ message: "Token Not Found" });
  }
  let adminId;

  // verify token
  jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
    if (err) {
      return res.status(400).json({ message: `${err.message}` });
    } else {
      adminId = decrypted.id;
      return;
    }
  });

  // create new movie
  const { title, description, actors, releaseDate, posterUrl, featured } =
    req.body;
  if (
    !title &&
   title.trim() === "" &&
    !description &&
    description.trim() === "" &&
    !posterUrl
    &&
    posterUrl.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  let movie;
  try {
    movie = new Movie({
      title,
      description,
      actors,
      releaseDate: new Date(`${releaseDate}`),
      posterUrl:posterUrl,
      featured,
      admin:adminId,
    });

    const session = await mongoose.startSession()
    const adminUser = await Admin.findById(adminId)
    await session.startTransaction()
    await movie.save({ session })
    adminUser.addedMovies.push(movie)
    await adminUser.save({ session })
    await session.commitTransaction()


  } catch (err) {
    return console.log(err.message);
    }
    if (!movie) {
        return res.status(500).json({message:"Request Failed"})
    }
    return res.status(201).json({movie})
};

const getAllMovies = async (req, res, next) => {
    let movies 
    try {
        movies = await Movie.find()
    } catch (err) {
        return console.log(err.message)
    }
    if (!movies) {
        return res.status(500).json({message:"Request Failed"})
    }
   return res.status(200).json({movies})
}

const getMovieById = async (req, res, next) => {
    const id = req.params.id 
    let movie 
    try {
        movie = await Movie.findById(id)
    } catch (err) {
        return console.log(err.message)
    }
    if (!movie) {
        return res.status(404).json({message:"Invalid Movie ID"})
    }
    return res.status(200).json({movie})
}

const func3 = { addMovie,getAllMovies, getMovieById };

module.exports = func3;
