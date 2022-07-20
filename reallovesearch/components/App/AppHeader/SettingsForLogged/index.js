import Link from "next/link";
import cn from "classnames";
import SettingsList from "components/SettingsList";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "store/auth/auth";
import initNotificationSocket from "api/sockets/initNotifications";
import initUsersOnlineSocket from "api/sockets/initUsersOnline";
import styles from './index.module.scss';
import linkStyles from "../_shared/index.module.scss";
import IconButton from "components/IconButton";
import Notifications from "components/Notifications";
import { userNotifications } from "store/notifications";

function SettingsForLogged({profile}) {
  const router = useRouter();
  const dispatch = useDispatch();

  const listCount = useSelector(userNotifications.selectors.listCount);
  const listIsVisible = useSelector(userNotifications.selectors.listIsVisible);
  const jwtToken = useSelector(auth.selectors.jwtToken);

  const links = [
    { label: 'Home', href: '/'},
    { label: 'Shared private albums', href: '/shared-private-albums'},
    { label: 'Chat', href: '/chat'},
    { label: 'My account', href: '/account/profile/personal'},
  ]

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

  const routeIsActive = (pathName) => {
    if(pathName.includes('account') && router.asPath.includes('account')) {
      return true
    }

    if(pathName.includes('chat') && router.asPath.includes('chat')) {
      return true
    }
    return router.asPath === pathName;
  };

  const handleListIsVisible = (value) => {
    dispatch(userNotifications.actions.SET_LIST_VISIBLE(value));
  };

  return (
    <div className="d-flex align-items-center">
      <IconButton
        className={cn(
          linkStyles['icon-button'],
          'mr-3'
        )}
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
      <div className={linkStyles['link-wrap']}>
        {links.map(({label, href}) => (
          <div key={label} className={styles.link}>
            <Link href={href}>
              <a className={cn(
                linkStyles.link,
                { [linkStyles['link__active']] : routeIsActive(href) },
                'text-md text-underline'
              )}>
                {label}
              </a>
            </Link>
          </div>
        ))}
      </div>
      <div className={linkStyles.menu}>
        <SettingsList
          userProfile={profile}
        />
      </div>
    </div>
  )
}

export default SettingsForLogged