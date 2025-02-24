// Transfer handler

import connectToDatabase from "@/utils/db";
import User from "@/models/User";
import Transaction from "@/models/Transaction";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  await connectToDatabase();

  const { fromEmail, toEmail, amount, name } = req.body;

  if (!fromEmail || !toEmail || !amount || !name) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  try {
    const fromUser = await User.findOne({ email: fromEmail });
    const toUser = await User.findOne({ email: toEmail });

    if (!fromUser || !toUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    const transferAmount = parseFloat(amount);

    if (isNaN(transferAmount) || transferAmount <= 0) {
      return res.status(400).json({ msg: "Invalid amount" });
    }

    if (fromUser.saldo < transferAmount) {
      return res.status(400).json({ msg: "Insufficient balance" });
    }

    // Perform the transfer (update the balance in the DB)
    fromUser.saldo -= transferAmount;
    toUser.saldo += transferAmount;

    await fromUser.save();
    await toUser.save();

    // Create transactions and save them with saldoAtTime
    const fromTransaction = new Transaction({
      email: fromUser.email,
      name,
      amount: `-${amount} €`,
      date: new Date(),
      value: transferAmount,
      saldoAtTime: fromUser.saldo, // This is where saldoAtTime gets set
    });

    const toTransaction = new Transaction({
      email: toUser.email,
      name: fromUser.nome,
      amount: `+${amount} €`,
      date: new Date(),
      value: transferAmount,
      saldoAtTime: toUser.saldo, // This is where saldoAtTime gets set
    });

    await fromTransaction.save();
    await toTransaction.save();

    fromUser.saldo -= transferAmount;
    toUser.saldo += transferAmount;
    await fromUser.save();
    await toUser.save();

    res.status(200).json({ msg: "Transfer successful" });
  } catch (err) {
    res.status(500).json({ msg: "Error processing transfer" });
  }
}
