import Button from "components/Button";
import IconButton from "components/IconButton";
import IconClose from "components/icons/IconClose";
import { useState } from "react";
import cn from "classnames";
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
    children,
    loader = false,
    size,
    dark = false,
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
        { [styles[`popup--${size}`]]: size },
        { [styles['popup--dark']]: dark },
      )}>
        <IconButton
          className={styles['icon-close']}
          onClick={onClose}
        >
          <IconClose color="#DCDEE7"/>
        </IconButton>
        
        <div className="text-center mb-2">
          {children}
        </div>
        
        <div className={cn(
          styles.actions,
          { [styles['actions--columns-1']]: !btnCancelIsVisible }
        )}>
          <Button
            size="sm"
            theme={dark ? '' : 'blue'}
            onClick={onConfirm}
            loader={loader}
            fullWidth={!btnCancelIsVisible}
            disabled={btnConfirmDisabled}
          >
            <span className="text-lg">{btnConfirmText}</span>
          </Button>
          {btnCancelIsVisible && (
            <Button
              size="sm"
              theme={dark ? '' : 'blue'}
              outline
              onClick={onCancel}
            >
              <span className={cn(
                { 'color-white': dark },
                'text-lg'
              )}>
                {btnCancelText}
              </span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PopupConfirm;
