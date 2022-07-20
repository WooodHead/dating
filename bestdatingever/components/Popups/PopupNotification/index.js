import IconButton from "components/IconButton";
import IconClose from "components/icons/IconClose";
import { useState } from "react";
import cn from "classnames";
import styles from "./index.module.scss";

function PopupNotification(
  {
    onClose,
    hideBtnClose = false,
    dark = false,
    children,
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
        { [styles['popup--dark']]: dark },
      )}>
        {!hideBtnClose && (
          <IconButton
            className={styles['icon-close']}
            onClick={onClose}
          >
            <IconClose color={dark ? 'white' : '#4B5064'}/>
          </IconButton>
        )}
        <div className={cn(styles.body, 'text-center')}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default PopupNotification;
