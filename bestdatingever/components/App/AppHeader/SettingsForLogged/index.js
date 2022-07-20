import Link from "next/link";
import IconButton from "components/IconButton";
import SettingsList from "components/SettingsList";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userNotifications } from "store/notifications";
import { auth } from "store/auth/auth";
import Notifications from "components/Notifications";
import initNotificationSocket from "api/sockets/initNotifications";
import initUsersOnlineSocket from "api/sockets/initUsersOnline";
import cn from "classnames";
import linkStyles from "../_shared/index.module.scss";
import styles from "./index.module.scss";

function SettingsForLogged({ profile }) {
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
      <div className={cn(
        styles.notifications,
        'mr-3 mr-sm-1'
      )}>
        <IconButton
          className={linkStyles['icon-button']}
          onClick={() => handleListIsVisible(true)}
        >
          <img
            src="/img/header/icon-bell.svg"
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
      <Link href="/chat">
        <a className="mr-5 mr-sm-4">
          <IconButton className={cn(
            linkStyles['icon-button'],
          )}>
            <img
              src="/img/header/icon-message.svg"
              alt=""
              className="icon-default"
            />
          </IconButton>
        </a>
      </Link>
      <Link href="/">
        <a className={cn(
          linkStyles.link,
          linkStyles['home-link'],
          'text-default text-semibold text-uppercase'
        )}>
          Home
        </a>
      </Link>
      <Link href="/account/shared/private-albums">
        <a className={cn(
          linkStyles.link,
          linkStyles['link-shared-albums'],
          'text-default text-semibold text-uppercase'
        )}>
          Shared albums
        </a>
      </Link>
      <SettingsList
        userProfile={profile}
      />
    </div>
  );
}

export default SettingsForLogged;
