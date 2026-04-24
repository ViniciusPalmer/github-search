import styles from "../styles/components/LoadingScreen.module.scss";

export function LoadingScreen() {
  return (
    <div className={styles.container}>
      <div className={styles.loader} role="status" aria-label="Carregando" />
    </div>
  );
}
