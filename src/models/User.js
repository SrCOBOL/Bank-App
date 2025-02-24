import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  saldo: { type: Number, default: 0 }, // Saldo inicial
});

const User =
  mongoose.models.User || mongoose.model("User", userSchema, "users");

export default User;
