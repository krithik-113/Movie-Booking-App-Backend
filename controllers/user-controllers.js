const Bookings = require("../models/Bookings");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    return next(err);
  }
  if (!users) {
    return res.status(500).json({ message: "Unexpected Error Occured" });
  }
  return res.status(200).json({ users });
};

const addUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (
    !name &&
    name.trim() === "" &&
    !email &&
    email.trim() === "" &&
    !password &&
    password.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }
  const hashedPassword = bcrypt.hashSync(password);
  let user;
  try {
    user = new User({ name, email, password: hashedPassword });
    user = await user.save();
  } catch (err) {
    return next(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Unexpected Error Occured" });
  }
  return res.status(201).json({ id:user._id });
};

const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { name, email, password } = req.body;
  if (
    !name &&
    name.trim() === "" &&
    !email &&
    email.trim() === "" &&
    !password &&
    password.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }
  const hashedPassword = bcrypt.hashSync(password);

  let user;
  try {
    user = await User.findByIdAndUpdate(id, {
      name,
      email,
      password: hashedPassword,
    });
  } catch (err) {
    return console.log(err.message);
  }
  if (!user) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  res.status(200).json({ message: "Updated Successfully" });
};

const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findByIdAndDelete(id);
  } catch (err) {
    return console.log(err.message);
  }
  if (!user) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  return res.status(200).json({ message: "Deleted Successfully" });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && email.trim() === "" && !password && password.trim() === "") {
    return res.status(422).json({ message: "Invalid Inputs" });
    }

    let existingUser
    try {
        existingUser = await User.findOne({ email })
        
    } catch (err) {
        return console.log(err.message)
    }
    if (!existingUser) {
        res.status(404).json({message:"Unable to find user from this ID"})
    }
    const isPasswordCorrect =await bcrypt.compare(password, existingUser.password)
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect Password" });
    }
    return res.status(200).json({message:"Login Successfully",id:existingUser._id})
};

const getBookingsOfUser = async (req, res, next) => {
  const id = req.params.id 
  let bookings 
  try {
    bookings = await Bookings.find({user:id})
  } catch (err) {
    return console.log(err.message)
  }
  if (!bookings) {
    return res.status(500).json({message:"Unable to get Booking"})
  }
  return res.status(200).json({bookings:bookings})
}

const getUserDetail = async (req, res, next) => {
  const id = req.params.id 
  let user 
  try {
    user = await User.findById(id)
  } catch (err) {
    return console.log(err.message)
  }
  if (!user) {
    return res.status(500).json({message:"Unexpected Error"})
  }
  return res.status(200).json({user})
}

const func = { getAllUsers, addUser, updateUser, deleteUser,login,getBookingsOfUser, getUserDetail };

module.exports = func;
