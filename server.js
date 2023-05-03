import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectToDb } from "./utils/db.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import userRoutes from "./routes/UserRoutes.js";
import { authenticateJwt, setUserRoles } from "./middleware/auth.middleware.js";
dotenv.config();
// connect to database
connectToDb();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/v1/users/auth/", AuthRoutes);
app.use(authenticateJwt);
app.use(setUserRoles);
app.use("/api/v1/", userRoutes);

// default routes
app.get("/", (req, res) => {
  res.json({ message: "hELLO ES6" });
});

mongoose.connection.once("open", () => {
  console.log("Connection to database established");
  app.listen(port, () =>
    console.log(
      `Server listening on ${process.env.HTTP_SCHEME}://${process.env.HOST}:${port}`
    )
  );
});
