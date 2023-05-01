import express from "express";
import { getAllUsers } from "../controllers/UserController.js";
import { getSingleUser } from "../controllers/UserController.js";
import {createUser} from "../controllers/UserController.js";
import { requireAdmin } from "../middleware/auth.middleware.js";


const router = express.Router();
// get all users
router.get("/users", getAllUsers);
// get a single user by id
router.get("/users/:id", getSingleUser);

// create a new user
router.post('/users',requireAdmin, createUser)

export default router;
