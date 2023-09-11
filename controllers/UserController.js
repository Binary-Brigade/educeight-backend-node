import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";
import { emailValidate } from "../utils/validators.js";

// @desc: Get all users
// @method: GET
// @Route: "/api/v1/users"
// @auth: private

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).json(allUsers);
  } catch (error) {
    console.log(error.message);
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json("user not found");
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};

export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // validate the email
    if (!emailValidate(email)) {
      return res.status(422).json({ error: "Email must be a valid email" });
    }
    //  check to make sure all fields are filled
    if (!firstName || !lastName || !email || !password || !role) {
      return res
        .status(400)
        .json({ error: "please make sure all fields are filled" });
    }

    // check if user is already registered
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
      return res
        .status(400)
        .json({ error: "A user with this email already exists" });
    }
    // create the user
    const newUser = await new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });
    try {
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
};

// @desc: Update a user
// @method: PUT
// @Route: "/api/v1/users/:id"
// @auth: private

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToUpdate = await User.findByIdAndUpdate(id, req.body);
    if (!userToUpdate) {
      return res.status(400).json({ error: "user not found" });
    }
    const updatedUser = await User.findById(id);
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc: Partial Update of a user
// @method: PATCH
// @Route: "/api/v1/users/:id"
// @auth: private

export const patchUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToPatch = await User.findByIdAndUpdate(id, req.body);
    if (!userToPatch) {
      return res.status(400).json({ error: "user not found" });
    }
    const patchedUser = await User.findById(id);
    res.status(200).json(patchedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc: Delete a user
// @method: DELETE
// @Route: "/api/v1/users/:id"
// @auth: private

export const deleteUser = async (req, res) => {
  const { id } = await req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return res.status(400).json({ message: "user not found" });
  }
  res.status(200).json({ message: `user with id ${id} deleted successfully` });
};
