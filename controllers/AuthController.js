import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { passwordValidate, emailValidate } from "../utils/validators.js";
import User from "../models/UserModel.js";

// @Method: "POST",
// @Route: /auth/register
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
  // validate email
  if (!emailValidate(email)) {
    return res.status(422).json({ error: "email must be a valid email" });
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
    refreshToken: null,
  });
  try {
    const savedUser = await newUser.save();
    res.status(201).send(savedUser);
  } catch (error) {
    console.log(error);
  }
};

// @Method: "POST",
// @Route: /auth/login
// @Desc: log in a user

const generateAccessToken = (id) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "10m" });
};

const generateRefreshToken = () => {
  let refreshToken = [];
  const refresh = jwt.sign({}, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "1d",
  });
  refreshToken.push(refresh);

  return refresh;
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  // check if the user exists in the database
  const user = await User.findOne({ email });
  const { role, id } = user;

  if (!user) {
    return res.status(400).json("User not found");
  }

  // compare passwords
  const validPassword = bcrypt.compare(user.password, password);
  if (!validPassword) {
    return res.status(400).json("wrong Email or Password");
  }

  try {
    const accessTkn = generateAccessToken({ id, role });
    const refreshTkn = generateRefreshToken();
    user.refreshToken = refreshTkn;

    await user.save();

    res.status(200).json({
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      accessToken: accessTkn,
      refreshToken: refreshTkn,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @Method: "POST",
// @Route: /auth/refresh
// @Desc: generate an access token with refresh token

// refresh token route
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      const accessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken();

      user.refreshToken = newRefreshToken;
      user.save();

      res.json({ accessToken, refreshToken: newRefreshToken });
    });
  } catch (err) {
    console.error("Error refreshing token:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
