import cn from "classnames";
import styles from './index.module.scss';

function IconButton(
  {
    onClick,
    children,
    className,
    color,
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
        className
      )}
      onClick={onClick}
    >
      <div className={styles.icon}>
        {children}
      </div>
    </div>
  );
}

export default IconButton;
