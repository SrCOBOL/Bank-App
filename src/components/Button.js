"use client";
import styles from "./styles/Button.module.css";

export default function Button({
  label,
  onClick,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${className}`}
    >
      {label}
    </button>
  );
}
