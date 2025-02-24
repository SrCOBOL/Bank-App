import connectToDatabase from "@/utils/db";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ msg: "Método não permitido!" });
  }

  await connectToDatabase();

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ msg: "Email não fornecido!" });
  }

  try {
    const user = await User.findOne({ email });

    // If the user is not found, return a 404 status
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado!" });
    }

    // Ensure saldo is a number before returning it
    const saldo = Number(user.saldo) || 0;
    if (isNaN(saldo)) {
      return res.status(500).json({ msg: "Saldo inválido!" });
    }

    // Return the saldo (balance) to the client
    res.status(200).json({ saldo });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ msg: "Erro ao buscar saldo!" });
  }
}
