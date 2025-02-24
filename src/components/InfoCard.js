import React from "react";
import styles from "./styles/InfoCard.module.css";

export default function InfoCard({ icon, title, info }) {
  return (
    <div className={styles.infoCard}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.info}>{info}</p>
      </div>
    </div>
  );
}
