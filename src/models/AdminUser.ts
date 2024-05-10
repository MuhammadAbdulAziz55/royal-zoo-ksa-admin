import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "username must be  unique"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    is_SupperAdmin: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true }
);
export const AdminUser =
  mongoose.models.AdminUser || mongoose.model("AdminUser", userSchema);
