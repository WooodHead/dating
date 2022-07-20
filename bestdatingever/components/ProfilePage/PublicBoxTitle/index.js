import styles from "./index.module.scss";

function PublicBoxTitle({ children }) {
  return (
    <div className={styles.title}>
      {children}
    </div>
  );
}

export default PublicBoxTitle;
