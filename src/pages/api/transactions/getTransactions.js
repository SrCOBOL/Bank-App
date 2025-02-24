import connectToDatabase from "@/utils/db";
import Transaction from "@/models/Transaction";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Method not allowed!" });
  }

  await connectToDatabase();

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ msg: "Email não fornecido!" });
  }

  try {
    const transactions = await Transaction.find({ email }).sort({ date: -1 });

    res.status(200).json({ transactions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erro ao buscar transações!" });
  }
}
