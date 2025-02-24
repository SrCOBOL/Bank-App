import connectToDatabase from "@/utils/db";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ msg: "Método não permitido!" });

  await connectToDatabase();

  const { nome, email, password, saldo } = req.body;

  // Verifique se todos os campos necessários foram fornecidos
  if (!nome || !email || !password || saldo === undefined) {
    return res.status(400).json({ msg: "Todos os campos são obrigatórios!" });
  }

  // Verifique se o usuário já existe
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ msg: "Usuário já existe!" });
  }

  try {
    // Criar um novo usuário
    user = new User({
      nome,
      email,
      password, // Senha em texto claro, sem hash
      saldo,
    });

    // Salve o usuário no banco de dados
    await user.save();

    res.status(201).json({
      msg: "Usuário criado com sucesso!",
      user: { id: user._id, nome: user.nome, saldo: user.saldo },
    });
  } catch (err) {
    res.status(500).json({ msg: "Erro ao adicionar o usuário!" });
  }
}
