import IconLoader from "components/icons/IconLoader";
import cn from "classnames";
import styles from "./index.module.scss";

function Loader({ size }) {
  return (
    <div className={styles.overlay}>
      <IconLoader
        className={cn(
          styles.loader,
          { [styles[`loader--${size}`]]: size }
        )}
      />
    </div>
  );
}

export default Loader;
