import React from "react";
import styles from "./styles/CircleButton.module.css";

export default function CircleButton({ icon, text, onClick }) {
  return (
    <div className={styles.circleButton} onClick={onClick}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.text}>{text}</div>
    </div>
  );
}
