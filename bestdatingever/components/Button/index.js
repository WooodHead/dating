import Loader from "components/Loader";
import cn from "classnames";
import styles from "./index.module.scss";

function Button(
  {
    type = 'button',
    outline = false,
    disabled = false,
    size,
    onClick,
    fullWidth = false,
    loader,
    className,
    theme,
    children,
    style,
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
        { [styles[`btn--${theme}`]]: theme && !outline },
        { [styles[`btn--outline-${theme}`]]: theme && outline },
        { [styles[`btn--events-none`]]: loader },
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
            { [styles[`btn--loader-${theme}`]]: theme },
          )}
        >
          <Loader size="sm"/>
        </div>
      )}
    </button>
  );
}

export default Button;
