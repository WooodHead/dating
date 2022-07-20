import Button from "components/Button";
import IconButton from "components/IconButton";
import IconClose from "components/icons/IconClose";
import { useState } from "react";
import cn from "classnames";
import stylesShared from "../_shared/index.module.scss";
import styles from "./index.module.scss";

function PopupConfirm(
  {
    btnConfirmText = 'Delete',
    btnConfirmDisabled = false,
    btnCancelText = 'Cancel',
    btnCancelIsVisible = true,
    onClose,
    onConfirm,
    onCancel,
    title,
    children,
    loader = false,
    size = null
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
        styles.popup,
        { [stylesShared['popup--active']]: active },
        { [styles[`popup--${size}`]]: size }
      )}>
        <IconButton
          className={styles['icon-close']}
          onClick={onClose}
        >
          <IconClose color="#6B6F77" />
        </IconButton>
        
        {title && (
          <div className="text-lg text-semibold text-center mb-4">
            {title}
          </div>
        )}
        
        <div className={cn(styles.children, 'mb-4')}>
          {children}
        </div>
        
        <div className={cn(
          styles.actions,
          { [styles['actions--columns-1']]: !btnCancelIsVisible }
        )}>
          <Button
            onClick={onConfirm}
            loader={loader}
            fullWidth={!btnCancelIsVisible}
            disabled={btnConfirmDisabled}
          >
            {btnConfirmText}
          </Button>
          {btnCancelIsVisible && (
            <Button
              outline
              onClick={onCancel}
              className="color-pink-700"
            >
              {btnCancelText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PopupConfirm;
