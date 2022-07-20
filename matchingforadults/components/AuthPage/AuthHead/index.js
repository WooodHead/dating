import cn from "classnames";
import styles from "./index.module.scss";

function AuthHead() {
  return (
    <div className={styles.wrap}>
      <img src="/img/auth/bg-auth.png" alt="" className={styles.couple} />
      <h1
        className={cn(
          styles.title,
          'text-normal text-palatino text-right'
        )}
      >
        Let Someone Steal Your Heart and Keep It Forever
      </h1>
    </div>
  );
}

export default AuthHead;
