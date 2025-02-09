const Admin = require("../models/Admin")
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")

const addAdmin = async(req, res, next) => {
    const { email, password } = req.body
    if (!email && email.trim() === "" && !password && password.trim() === "") {
      return res.status(422).json({ message: "Invalid Inputs" });
    }
    let existingAdmin
    try {
       existingAdmin = await Admin.findOne({email})
    } catch (err) { Admin
        return console.log(err.message)
    }
    if (existingAdmin) {
        return res.status(400).json({message:"Admin already exists"})
    }

    let admin
    const hashedPassword = bcrypt.hashSync(password)
    try {
        admin = new Admin({ email, password: hashedPassword })
        admin = await admin.save()
    } catch (err) {
        return console.log(err.message)
    }
    if (!admin) {
        return res.status(500).json({message:"Unable to store admin"})
    }
    return res.status(201).json({admin})
}

const adminLogin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email && email.trim() === "" && !password && password.trim() === "") {
      return res.status(422).json({ message: "Invalid Inputs" });
    }
    let existingAdmin 
    try {
        existingAdmin = await Admin.findOne({email})
    } catch (err) {
        return console.log(err.message)
    }
    if (!existingAdmin) {
        return res.status(400).json({message:"Admin not found"})
    }
    const isPasswordCorrect = await bcrypt.compare(password, existingAdmin.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({message:'Incorrect Password'})
    }
    const token = jwt.sign({ id: existingAdmin._id }, process.env.SECRET_KEY, {
        expiresIn:"7d"
    });
    return res.status(200).json({message:"Authentication Complete",token,id:existingAdmin._id})
    
}

const getAdmins = async (req, res, next) => {
    let admins 
    try {
        admins = await Admin.find()
    } catch (err) {
        return console.log(err.message)
    }
    if (!admins) {
        return res.status(500).json({message:"Internal Server Error"})
    }
    return res.status(200).json({admins})
}

const getAdminById = async (req, res, next) => {
    const id = req.params.id 
    let admin 
    try {
        admin = await Admin.findById(id).populate('addedMovies')
    } catch (err) {
        return console.log(err.message)
    }
    if (!admin) {
        return res.status(500).json({message:'Cannot find Admin'})
    }
    return res.status(200).json({admin})
}

const func1 = { addAdmin,adminLogin , getAdmins,getAdminById}

module.exports = func1