import connectToDatabase from "@/utils/db";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ msg: "Método não permitido!" });

  await connectToDatabase();

  const { email } = req.body; // Only get email from the request body, no need for password

  // Verifique se o e-mail foi fornecido
  if (!email) {
    return res.status(400).json({ msg: "Email não fornecido!" });
  }

  try {
    // Verifique se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Usuário não encontrado!" });
    }

    // Se tudo estiver correto, faça o login
    res.status(200).json({ msg: "Login bem-sucedido!", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erro no servidor!" });
  }
}
