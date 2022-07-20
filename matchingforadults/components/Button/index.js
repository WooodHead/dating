import Loader from "components/Loader";
import cn from "classnames";
import styles from "./index.module.scss";

function Button(
  {
    type = 'button',
    outline = false,
    border = true,
    disabled = false,
    size,
    onClick,
    fullWidth = false,
    pink = false,
    loader,
    className,
    children,
    style,
    dark
  }
) {
  return (
    <button
      type={type}
      className={cn(
        styles.btn,
        !outline ? styles['btn--solid'] : styles['btn--outline'],
        { [styles['btn--disabled']]: disabled },
        { [styles[`btn--${size}`]]: size },
        { [styles[`btn--full-width`]]: fullWidth },
        { [styles[`btn--pink`]]: pink },
        { [styles['btn--outline-pink']]: outline && pink },
        { [styles['btn--outline-dark']]: outline && dark },
        { [styles[`btn--events-none`]]: loader },
        { [styles['btn--border-none']]: !border },
        className
      )}
      disabled={disabled}
      onClick={onClick}
      style={style}
    >
      {children}
      {loader && (
        <div
          className={cn(
            styles['btn--loader'],
            { [styles[`btn--loader-pink`]]: pink },
          )}
        >
          <Loader size="sm"/>
        </div>
      )}
    </button>
  );
}

export default Button;
