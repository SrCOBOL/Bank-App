import connectToDatabase from "@/utils/db";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import fs from "fs";
import path from "path";
import { runCobolProgram } from "@/utils/cobol";

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

    const inputContent = `
0001 ${fromEmail} ${name} -${transferAmount.toFixed(
      2
    )} ${new Date().toISOString()}
0002 ${toEmail} ${fromUser.nome} +${transferAmount.toFixed(
      2
    )} ${new Date().toISOString()}
`;

    console.log("Input Content for COBOL:", inputContent);

    await runCobolProgram(inputContent);

    const outputPath = path.join(process.cwd(), "src/cobol/output.txt");
    const cobolOutput = fs.readFileSync(outputPath, "utf-8");
    console.log("COBOL Output:", cobolOutput);

    const lines = cobolOutput.split("\n").filter((line) => line.trim() !== "");
    for (const line of lines) {
      const [transactionId, transactionStatus] = line.split(/\s+/);
      if (transactionStatus === "SUCCESS") {
        fromUser.saldo -= transferAmount;
        toUser.saldo += transferAmount;
        await fromUser.save();
        await toUser.save();

        const fromTransaction = new Transaction({
          email: fromUser.email,
          name,
          amount: `-${amount} €`,
          date: new Date(),
          value: transferAmount,
        });

        const toTransaction = new Transaction({
          email: toUser.email,
          name: fromUser.nome,
          amount: `+${amount} €`,
          date: new Date(),
          value: transferAmount,
        });

        await fromTransaction.save();
        await toTransaction.save();

        res.status(200).json({ msg: "Transfer successful" });
        return;
      } else {
        res.status(500).json({ msg: "COBOL Processing Failure" });
        return;
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error processing transfer" });
  }
}
