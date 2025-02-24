import React from "react";
import styles from "./styles/TransactionList.module.css";

export default function TransactionList({ transactions, globalSaldo }) {
  return (
    <div className={styles.transactionList}>
      {transactions.map((transaction) => {
        // Se a transação tiver um snapshot de saldo, use-o; caso contrário, use o global
        const saldoParaExibir =
          transaction.saldoAtTime !== undefined
            ? transaction.saldoAtTime
            : globalSaldo;
        return (
          <div
            key={transaction._id || new Date(transaction.date).getTime()}
            className={styles.transactionItem}
          >
            <div className={styles.icon}>
              {transaction.amount.startsWith("+") ? "💰" : "💸"}
            </div>
            <div className={styles.details}>
              <div className={styles.name}>{transaction.name}</div>
              <div className={styles.amount}>{transaction.amount}</div>
              <div className={styles.remaining}>
                Saldo:{" "}
                {Number(saldoParaExibir).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                €
              </div>
              <div className={styles.date}>
                {new Date(transaction.date).toLocaleDateString()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
