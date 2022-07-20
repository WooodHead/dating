import Loader from "components/Loader";
import cn from "classnames";
import styles from "./index.module.scss";

function Button(
  {
    type = 'button',
    text,
    textSize,
    outline = false,
    disabled = false,
    size,
    color = '',
    onClick,
    fullWidth = false,
    transparent = false,
    dark = false,
    loader,
    className,
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
        { [styles[`btn--dark`]]: dark },
        { [styles[`btn--transparent`]]: transparent },
        { [styles[`btn--events-none`]]: loader },
        className
      )}
      disabled={disabled}
      onClick={onClick}
      style={style}
    >
      <span
        style={{ color: color }}
        className={cn(
          { [`text-${textSize}`]: textSize }
        )}
      >
        {text}
      </span>
      {loader && (
        <div
          className={cn(
            styles['btn--loader'],
            { [styles[`btn--loader-dark`]]: dark },
          )}
        >
          <Loader size="sm"/>
        </div>
      )}
    </button>
  );
}

export default Button;
