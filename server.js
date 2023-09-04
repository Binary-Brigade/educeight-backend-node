import express from "express";
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

app.use("/api/v1/auth/", AuthRoutes);
app.use(authenticateJwt);
app.use(setUserRoles);
app.use("/api/v1/", userRoutes);

// default routes
app.get("/healthcheck", (req, res) => {
  res.json({ status: "success", message: "Healthcheck complete. Successful check" });
});

mongoose.connection.once("open", () => {
  console.log("Connection to database established");
  app.listen(port, () =>
    console.log(
      `Server listening on ${process.env.HTTP_SCHEME}://${process.env.HOST}:${port}`
    )
  );
});
