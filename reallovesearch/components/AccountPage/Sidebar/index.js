import { useRouter } from "next/router";
import IconUser from "components/icons/IconUser";
import IconPhoto from "components/icons/IconPhoto";
import IconLogout from "components/icons/IconLogout";
import IconSettings from "components/icons/IconSettings";
import IconSubscription from "components/icons/IconSubscription";
import IconSupport from "components/icons/IconSupport";
import cn from "classnames";
import styles from "./index.module.scss";
import { useDispatch } from "react-redux";
import { auth } from "store/auth/auth";

function Sidebar() {
  const router = useRouter();
  const dispatch = useDispatch();

  const routeActive = (basePath) => router.pathname.includes(basePath);

  const routeList = [
    {
      // eslint-disable-next-line react/display-name
      icon: (active) => <IconUser color="#000000"/>,
      name: 'Personal',
      basePath: 'profile',
      onClick: () => router.push('/account/profile/personal')
    },
    {
      // eslint-disable-next-line react/display-name
      icon: (active) => <IconPhoto color="#000000"/>,
      name: 'Photos',
      basePath: 'photos',
      onClick: () => router.push('/account/photos/main-photos'),
      children: [
        {
          basePath: 'photos/main-photos',
          title: 'My main photos',
          onClick: () => router.push('/account/photos/main-photos')
        },
        {
          basePath: 'photos/public-albums',
          title: 'My public albums',
          onClick: () => router.push('/account/photos/public-albums')
        },
        {
          basePath: 'photos/private-albums',
          title: 'My private albums',
          onClick: () => router.push('/account/photos/private-albums')
        },
      ]
    },
    {
      // eslint-disable-next-line react/display-name
      icon: (active) => <IconSettings color="#000000"/>,
      name: 'Settings',
      basePath: 'settings',
      onClick: () => router.push('/account/settings/change-email'),
      children: [
        {
          basePath: 'settings/change-email',
          title: 'Change email',
          onClick: () => router.push('/account/settings/change-email')
        },
        {
          basePath: 'settings/change-phone',
          title: 'Change phone',
          onClick: () => router.push('/account/settings/change-phone')
        },
        {
          basePath: 'settings/change-password',
          title: 'Change password',
          onClick: () => router.push('/account/settings/change-password')
        },
        {
          basePath: 'settings/notifications',
          title: 'Notification',
          onClick: () => router.push('/account/settings/notifications')
        },
      ]
    },
    {
      // eslint-disable-next-line react/display-name
      icon: (active) => <IconSubscription color="#000000"/>,
      name: 'My subscription',
      basePath: 'subscription',
      onClick: () => router.push('/account/subscription')
    },
    {
      // eslint-disable-next-line react/display-name
      icon: (active) => <IconSupport color="#000000"/>,
      name: 'Support',
      basePath: 'support',
      onClick: () => router.push('/support')
    },
    {
      // eslint-disable-next-line react/display-name
      icon: () => <IconLogout color="#000000"/>,
      name: 'Log out',
      basePath: 'logout',
      onClick: () => dispatch(auth.thunks.logout())
    },
  ];

  return (
    <div className={styles.sidebar}>
      <div className={styles.list}>
        {routeList.map(item => (
          <div
            key={item.name}
            className="mb-2"
          >
            <div
              onClick={item.onClick}
              className={cn(
                styles['list__item'],
                'd-inline-flex align-items-center',
                { [styles['list__item--active']]: routeActive(item.basePath) }
              )}
            >
              {item.icon()}
              <div className="text-semibold ml-1">{item.name}</div>
            </div>
            {item.children && (
              <div className={styles.submenu}>
                {item.children.map(child => (
                  <div
                    key={child.title}
                    className={cn(
                      styles['submenu__item'],
                      { [styles['submenu__item--active']]: router.pathname.includes(child.basePath) }
                    )}
                    onClick={child.onClick}
                  >
                    {child.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
