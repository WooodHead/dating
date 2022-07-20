import Button from "components/Button";
import IconButton from "components/IconButton";
import IconClose from "components/icons/IconClose";
import styles from "./index.module.scss";
import cn from "classnames";
import { useState } from "react";

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
    size = null
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
        { [styles[`popup--${size}`]]: size }
      )}>
        <IconButton
          className={styles['icon-close']}
          onClick={onClose}
        >
          <IconClose color="#333333" />
        </IconButton>
        <div className="text-lg text-semibold mb-4 color-blue-900">
          {children}
        </div>
        <div className={cn(
          styles.actions,
          { [styles['actions--columns-1']]: !btnCancelIsVisible }
        )}>
          <Button
            text={btnConfirmText}
            textSize="md"
            onClick={onConfirm}
            loader={loader}
            fullWidth={!btnCancelIsVisible}
            disabled={btnConfirmDisabled}
            dark
          />
          {btnCancelIsVisible && (
            <Button
              text={btnCancelText}
              textSize="md"
              outline
              onClick={onCancel}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default PopupConfirm;
