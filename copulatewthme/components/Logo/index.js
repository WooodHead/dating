import styles from "./index.module.scss";

function Logo() {
  return (
      <img
        src="/img/logo/logo-main.svg"
        alt=""
        className={styles.logo}
      />
  );
}

export default Logo;
