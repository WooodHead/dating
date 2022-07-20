import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userNotifications } from "store/notifications";
import { auth } from "store/auth/auth";
import Notifications from "components/Notifications";
import initNotificationSocket from "api/sockets/initNotifications";
import initUsersOnlineSocket from "api/sockets/initUsersOnline";
import Button from "components/Button";
import IconMobileMenu from "components/icons/IconMobileMenu";
import IconButton from "components/IconButton";
import cn from "classnames";
import linkStyles from "../_shared/index.module.scss";
import styles from "./index.module.scss";

function SettingsForLogged() {
  const dispatch = useDispatch();
  const listCount = useSelector(userNotifications.selectors.listCount);
  const listIsVisible = useSelector(userNotifications.selectors.listIsVisible);
  const jwtToken = useSelector(auth.selectors.jwtToken);
  
  useEffect(() => {
    dispatch(userNotifications.thunks.getNotifications());
  }, []);
  
  useEffect(() => {
    const notificationSocket = new initNotificationSocket({ jwtToken });
    notificationSocket.init();
    notificationSocket.connectToNotification();
    
    return () => notificationSocket.socketDisconnect();
  }, []);
  
  useEffect(() => {
    const userIsOnline = new initUsersOnlineSocket({ jwtToken });
    userIsOnline.init();
    userIsOnline.connectUsersToSystem();
    
    return () => userIsOnline.socketDisconnect();
  }, []);
  
  const handleListIsVisible = (value) => {
    dispatch(userNotifications.actions.SET_LIST_VISIBLE(value));
  };
  
  return (
    <div className="d-flex align-items-center">
      <Link href="/">
        <a className={cn(
          linkStyles.link,
          'text-lg text-underline'
        )}>
          Home
        </a>
      </Link>
  
      <div className={styles.notifications}>
        <IconButton
          className={linkStyles['icon-button']}
          onClick={() => handleListIsVisible(true)}
        >
          <img
            src="/img/header/icon-notification.svg"
            alt=""
            className="icon-default"
          />
          {listCount > 0 && (
            <div className={styles['notifications__count']}>{listCount}</div>
          )}
        </IconButton>
        {listIsVisible && (
          <Notifications onClose={() => handleListIsVisible(false)}/>
        )}
      </div>
      
      <Button
        outline
        className={styles.logout}
        onClick={() => dispatch(auth.thunks.logout())}
      >
        Log out
      </Button>
  
      <div className={styles.burger}>
        <IconMobileMenu color="#3E2841" className="cursor-pointer ml-2"/>
      </div>
    </div>
  );
}

export default SettingsForLogged;
