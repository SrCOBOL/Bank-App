import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  amount: { type: String, required: true },
  date: { type: Date, default: Date.now },
  value: { type: Number, required: true },
});

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema, "transactions");

export default Transaction;
