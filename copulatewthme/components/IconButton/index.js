import cn from "classnames";
import styles from './index.module.scss';

function IconButton(
  {
    onClick,
    children,
    className,
    color,
    disabled = false,
    padding = 8
  }
) {
  return (
    <div
      style={{
        '--color': color,
        '--padding': padding + 'px'
      }}
      className={cn(
        styles.btn,
        { [styles['btn--disabled']]: disabled },
        className
      )}
      onClick={!disabled ? onClick : null}
    >
      <div className={styles.icon}>
        {children}
      </div>
    </div>
  );
}

export default IconButton;
