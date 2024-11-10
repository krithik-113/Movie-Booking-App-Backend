const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require('cors')
const userRouter = require("./routes/user-router");
const adminRouter = require("./routes/admin-routes");
const movieRouter = require("./routes/movie-routes");
const bookingsRouter = require("./routes/booking-routes");
dotenv.config();
const app = express();

// middlewares
app.use(express.json());
app.use(cors())
app.use("/users", userRouter)
app.use('/admin', adminRouter)
app.use('/movie', movieRouter)
app.use('/booking',bookingsRouter)

mongoose
  .connect(
    `mongodb+srv://krithikroshan113:${process.env.MONGODB_PASSWORD}@cluster0.lub6o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() =>
    app.listen(5000,'0.0.0.0', () => {
      console.log(`Connected To Database and Server is running`);
    })
  )
  .catch((e) => console.log(e.message));
