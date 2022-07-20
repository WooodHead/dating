import cn from "classnames";
import styles from "./index.module.scss";

function ButtonInline(
  {
    // disabled = false,
    iconPrepend,
    children,
    onClick,
    className
  }
) {
  return (
    <button
      type="button"
      className={cn(
        styles.btn,
        className
      )}
      // disabled={disabled}
      onClick={onClick}
    >
      {iconPrepend && <div className={styles['icon-prepend']}>{iconPrepend}</div>}
      {children}
    </button>
  );
}

export default ButtonInline;
