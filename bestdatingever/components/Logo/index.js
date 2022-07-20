import styles from "./index.module.scss";
import cn from "classnames";

function Logo({ size }) {
  return (
      <img
        src="/img/logo/logo-main.svg"
        alt=""
        className={cn(
          styles.logo,
          { [styles[`logo--${size}`]]: size }
        )}
      />
  );
}

export default Logo;
