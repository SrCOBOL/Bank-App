"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/Input";
import Button from "@/components/Button";
import styles from "@/components/styles/Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Erro no login");

      const data = await res.json();

      localStorage.setItem("email", data.user.email);
      router.push("/dashboard");
    } catch (err) {
      alert("Login inválido!");
    }
  };

  const handleCreateAccount = () => {
    router.push("/createaccount");
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleLogin} className={styles.form}>
        <h2 className={styles.title}>Login</h2>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu email"
        />
        <Input
          label="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Digite sua senha"
        />
        <Button type="submit" label="Entrar" className={styles.button} />
      </form>
      <div className="mt-4 text-center">
        <Button
          type="button"
          label="Criar Conta"
          className={styles.createAccountButton}
          onClick={handleCreateAccount}
        />
      </div>
    </div>
  );
}
