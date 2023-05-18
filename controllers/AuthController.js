import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { passwordValidate } from "../utils/passwordValidate.js";
import User from "../models/UserModel.js";

// @Method: "POST",
// @Route: users/auth/register
// @Desc: registers a new user and saves them to the database
export const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  // validate password
  if (!passwordValidate(password)) {
    return res.status(422).json({
      error:
        "The password must contain an uppercase letter, lowercase letter, number and special character",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  if (!firstName || !lastName || !email || !password) {
    res.status(400).json({ error: "all fields must be populated" });
  }
  // check if user exists

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res
      .status(400)
      .json({ error: "A user with This email already exists on the platform" });
  }

  const newUser = new User({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashedPassword,
  });
  try {
    const savedUser = await newUser.save();
    res.status(201).send(savedUser);
  } catch (error) {
    console.log(error);
  }
};

// @Method: "POST",
// @Route: users/auth/login
// @Desc: log in a user

export const login = async (req, res) => {
  const { email, password } = req.body;

  // check if the user exists in the database
  const user = await User.findOne({ email });
  const { role } = user;
  const generateToken = (id) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
  };
  if (!user) {
    return res.status(400).json("User not found");
  }

  // compare passwords
  const validPassword = bcrypt.compare(user.password, password);
  if (!validPassword) {
    return res.status(400).json("wrong Email or Password");
  }
  try {
    res.status(200).json({
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      accessToken: generateToken(user._id, user.role),
    });
  } catch (err) {
    console.log(err);
  }
};
