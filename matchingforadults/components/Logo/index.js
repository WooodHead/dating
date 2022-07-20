import styles from "./index.module.scss";

function Logo({ isLogged = false }) {
  return (
    <>
      {isLogged ? (
        <>
          <img src="/img/logo/logo-black.svg" alt="" className={styles.logo} />
          <img src="/img/logo/logo-mobile--pink.svg" alt="" className={styles['logo-mobile']} />
        </>
      ) : (
        <>
          <img src="/img/logo/logo-main.svg" alt="" className={styles.logo} />
          <img src="/img/logo/logo-mobile.svg" alt="" className={styles['logo-mobile']} />
        </>
      )}
    </>
  );
}

export default Logo;
