"use client";

import { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import styles from "@/components/styles/CreateAccount.module.css";

export default function CreateAccount() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [saldo, setSaldo] = useState(0);
  const router = useRouter();

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/addUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, password: senha, saldo }),
      });

      if (!res.ok) throw new Error("Erro ao criar o usuário");

      const data = await res.json();
      alert("Usuário criado com sucesso!");

      router.push("/login");
    } catch (err) {
      alert("Erro ao criar o usuário!");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleCreateUser} className={styles.form}>
        <h2 className={styles.title}>Criar Conta</h2>
        <Input
          label="Nome"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Digite o nome"
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite o email"
        />
        <Input
          label="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Digite a senha"
        />
        <Input
          label="Saldo"
          type="number"
          value={saldo}
          onChange={(e) => setSaldo(e.target.value)}
          placeholder="Digite o saldo"
        />
        <Button type="submit" label="Criar Conta" className={styles.button} />
      </form>
    </div>
  );
}
