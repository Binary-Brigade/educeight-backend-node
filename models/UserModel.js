import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      min: 6,
      max: 255,
    },
    password: { type: String, required: true, min: 6, max: 255 },
    role: { type: String, enum: ['user', 'admin', 'superAdmin', 'teacher', 'parent', 'student' ], default: 'user', required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
