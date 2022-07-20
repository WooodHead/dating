import IconButton from "components/IconButton";
import IconClose from "components/icons/IconClose";
import { useState } from "react";
import cn from "classnames";
import stylesShared from "../_shared/index.module.scss";
import styles from "./index.module.scss";

function PopupNotification(
  {
    onClose,
    hideBtnClose = false,
    title,
    children,
  }
) {
  const [active, setActive] = useState(false);
  
  setTimeout(() => setActive(true), 0);
  
  return (
    <div className={cn(
      stylesShared.overlay,
      { [stylesShared['overlay--active']]: active }
    )}>
      <div className={cn(
        stylesShared.popup,
        { [stylesShared['popup--active']]: active },
        { [styles['popup--title']]: title },
      )}>
        {!hideBtnClose && (
          <IconButton
            className={styles['icon-close']}
            onClick={onClose}
          >
            <IconClose color="#6B6F77" />
          </IconButton>
        )}
        {title && (
          <div className="text-center mb-1">
            {title}
          </div>
        )}
        <div className={cn(styles.body, 'text-center')}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default PopupNotification;
