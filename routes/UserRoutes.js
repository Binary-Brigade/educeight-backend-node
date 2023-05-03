import express from "express";
import { getAllUsers } from "../controllers/UserController.js";
import { getSingleUser } from "../controllers/UserController.js";
import {createUser} from "../controllers/UserController.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { updateUser } from "../controllers/UserController.js";
import {patchUser} from "../controllers/UserController.js";
import { deleteUser } from "../controllers/UserController.js";


const router = express.Router();
// get all users
router.get("/users", getAllUsers);
// get a single user by id
router.get("/users/:id", getSingleUser);

// create a new user
router.post('/users',requireAdmin, createUser)

// update user
router.put("/users/:id",requireAdmin, updateUser);

// partially update user
router.patch("/users/:id",requireAdmin, patchUser);

// delete user
router.delete("/users/:id",requireAdmin, deleteUser);


export default router;
