import IconButton from "components/IconButton";
import IconClose from "components/icons/IconClose";
import { useState } from "react";
import cn from "classnames";
import styles from "./index.module.scss";

function PopupNotification(
  {
    onClose,
    hideBtnClose = false,
    children,
    title,
    textSize = 'lg'
  }
) {
  const [active, setActive] = useState(false);
  
  setTimeout(() => setActive(true), 0);
  
  return (
    <div className={cn(
      styles.overlay,
      { [styles['overlay--active']]: active }
    )}>
      <div className={cn(
        styles.popup,
        { [styles['popup--active']]: active },
        { [styles['popup--title']]: title },
      )}>
        {!hideBtnClose && (
          <IconButton
            className={styles['icon-close']}
            onClick={onClose}
          >
            <IconClose/>
          </IconButton>
        )}
        <div className={cn(
          styles.body,
          `text-${textSize} text-semibold text-center`
        )}>
          {title}
          {children}
        </div>
      </div>
    </div>
  );
}

export default PopupNotification;
