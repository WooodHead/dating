import cn from "classnames";
import styles from "./index.module.scss";

const avatarSizes = {
  default: 50,
  xs: 30,
}

function Avatar(
  {
    size,
    thumb,
    name = 'Avatar',
    className,
    isOnline,
  }
) {
  let formattedName
  if (!thumb) {
    const splitName = name.split(' ');
    formattedName = splitName.length > 1 ?
      splitName[0].charAt(0) + splitName[1].charAt(0) :
      splitName[0].substr(0, 2);
  }

  const avatarSize = avatarSizes[size] || avatarSizes.default

  const avatar = thumb ? (
    <img src={thumb} alt="" width={avatarSize} height={avatarSize}/>
  ) : (
    <div className="text-sm text-semibold text-uppercase">
      {formattedName}
    </div>
  );

  return (
    <div className={cn(
      className,
      styles.avatar,
      {[styles[`avatar--${size}`]]: size},
    )}>
      {avatar}

      {isOnline && (
        <div className={styles['status-circle']}/>
      )}
    </div>
  );
}

export default Avatar;
