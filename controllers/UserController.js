import bcrypt from 'bcryptjs'
import User from '../models/UserModel.js';

// @desc: Get all users
// @method: GET
// @Route: "/api/v1/users"
// @auth: private

export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await  User.find({})
        res.status(200).json(allUsers)
        
    } catch (error) {
        console.log(error)
    }

}

export const getSingleUser = async (req, res) => {
    try {
        const {id} =  req.params;
        const user = await User.findById(id)
        if(!user){
            return res.status(400).json("user not found")
        }
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }
}

export const createUser = async(req, res) => {
    try {
  const { firstName, lastName, email, password, role } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt)

    //  check to make sure all fields are filled
    if(!firstName || !lastName || !email || !password || !role){
        return res.status(400).json({error: "please make sure all fields are filled"})
    }

    // check if user is already registered
    const isRegistered = await User.findOne({email})
    if(isRegistered){
        return res.status(400).json({error: "A user with this email already exists"})
    }
    // create the user
    const newUser = await new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role
    });
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
    } catch (err) {
        console.log(err)
    }
    } catch (err) {
        console.log(err)
    }
}

