"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import CircleButton from "@/components/CircleButton";
import FlatButton from "@/components/FlatButton";
import InfoCard from "@/components/InfoCard";
import TransactionList from "@/components/TransactionList";
import styles from "@/components/styles/Dashboard.module.css";

export default function Dashboard() {
  const [saldo, setSaldo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [transferEmail, setTransferEmail] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [showTransferForm, setShowTransferForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = localStorage.getItem("email");
        if (!email) {
          alert("Email não encontrado, por favor faça o login novamente.");
          return;
        }

        const [saldoRes, transactionsRes] = await Promise.all([
          fetch(`/api/users/saldo?email=${email}`),
          fetch(`/api/transactions/getTransactions?email=${email}`),
        ]);

        if (!saldoRes.ok || !transactionsRes.ok) {
          throw new Error("Erro ao buscar dados");
        }

        const saldoData = await saldoRes.json();
        const transactionsData = await transactionsRes.json();

        setSaldo(Number(saldoData.saldo) || 0);
        setTransactions(transactionsData.transactions);
      } catch (err) {
        alert("Erro ao carregar dados!");
      }
    };

    fetchData();
  }, []);

  const handleTransfer = async () => {
    try {
      const fromEmail = localStorage.getItem("email");
      const amountParsed = parseFloat(transferAmount);
      if (isNaN(amountParsed) || amountParsed <= 0) {
        alert("Valor inválido para transferência!");
        return;
      }
      if (saldo === null || saldo < amountParsed) {
        alert("Saldo insuficiente!");
        return;
      }

      const res = await fetch(`/api/transactions/transfer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromEmail,
          toEmail: transferEmail,
          amount: transferAmount,
          name: "Transferência",
        }),
      });

      if (!res.ok) throw new Error("Erro ao realizar transferência");

      const data = await res.json();
      alert("Transferência realizada com sucesso!");

      const novoSaldo = saldo - amountParsed;
      setSaldo(novoSaldo);

      const novaTransacao = {
        _id: new Date().getTime(),
        email: fromEmail,
        name: transferEmail,
        amount: `-${transferAmount} €`,
        date: new Date(),
        value: amountParsed,
        saldoAtTime: novoSaldo,
      };

      setTransactions((prev) => [novaTransacao, ...prev]);

      setTransferEmail("");
      setTransferAmount("");
      setShowTransferForm(false);
    } catch (err) {
      alert("Erro ao realizar transferência!");
    }
  };

  return (
    <div className={styles.container}>
      <Button
        label="Sair"
        onClick={() => {
          window.location.href = "/login";
        }}
        className="absolute top-4 right-4"
      />
      <Card className={styles.card}>
        {saldo !== null ? (
          <p className={styles.balance}>
            Saldo:{" "}
            {Number(saldo).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            €
          </p>
        ) : (
          <p className={styles.loading}>Carregando...</p>
        )}
        <div className={styles.grid}>
          <CircleButton
            icon="🔄"
            text="Transferir"
            onClick={() => setShowTransferForm(!showTransferForm)}
          />
          <CircleButton
            icon="📂"
            text="Ver Mov"
            onClick={() => alert("Ver Mov clicado!")}
          />
          <CircleButton
            icon="💳"
            text="Pedir Cartão"
            onClick={() => alert("Pedir Cartão clicado!")}
          />
        </div>
        {showTransferForm && (
          <div className={styles.transferSection}>
            <h3>Fazer Transferência</h3>
            <input
              type="email"
              placeholder="Email do destinatário"
              value={transferEmail}
              onChange={(e) => setTransferEmail(e.target.value)}
              className={styles.input}
            />
            <input
              type="number"
              placeholder="Valor"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              className={styles.input}
            />
            <Button
              label="Transferir"
              onClick={handleTransfer}
              className={styles.transferButton}
            />
          </div>
        )}
        <FlatButton
          text="Criar Objetivo de Poupança"
          onClick={() => alert("Criar Objetivo de Poupança clicado!")}
        />
        <InfoCard
          icon="💡"
          title="Notificação"
          info="O seu novo cartão está disponível para ser levantado."
          className="mt-8"
        />

        <TransactionList transactions={transactions} globalSaldo={saldo || 0} />
      </Card>
    </div>
  );
}
