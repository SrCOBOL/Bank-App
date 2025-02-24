import React from "react";
import styles from "./styles/FlatButton.module.css";

export default function FlatButton({ text, onClick }) {
  return (
    <div className={styles.flatButton} onClick={onClick}>
      <div className={styles.text}>{text}</div>
    </div>
  );
}
