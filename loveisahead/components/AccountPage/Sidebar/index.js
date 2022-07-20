import { useRouter } from "next/router";
import IconUser from "components/icons/IconUser";
import IconPhoto from "components/icons/IconPhoto";
import IconLogout from "components/icons/IconLogout";
import IconUnlock from "components/icons/IconUnlock";
import IconSubscription from "components/icons/IconSubscription";
import cn from "classnames";
import styles from "./index.module.scss";
import { useDispatch } from "react-redux";
import { auth } from "store/auth/auth";

function Sidebar({className}) {
  const router = useRouter();
  const dispatch = useDispatch();

  const routeActive = (basePath) => router.pathname.includes(basePath);

  const routeList = [
    {
      // eslint-disable-next-line react/display-name
      icon: (active) => <IconUser color={active ? '#EF4D1A' : '#5B676D'}/>,
      name: 'My Profile',
      basePath: 'profile',
      onClick: () => router.push('/account/profile/personal')
    },
    {
      // eslint-disable-next-line react/display-name
      icon: (active) => <IconPhoto color={active ? '#EF4D1A' : '#5B676D'}/>,
      name: 'My Photos',
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
      icon: (active) => <IconUnlock color={active ? '#EF4D1A' : '#5B676D'}/>,
      name: 'Shared private albums',
      basePath: 'shared',
      onClick: () => router.push('/account/shared/private-albums')
    },
    {
      // eslint-disable-next-line react/display-name
      icon: (active) => <IconSubscription color={active ? '#EF4D1A' : '#5B676D'}/>,
      name: 'My subscription',
      basePath: 'subscription',
      onClick: () => router.push('/account/subscription')
    },
    {
      // eslint-disable-next-line react/display-name
      icon: () => <IconLogout/>,
      name: 'Log out',
      basePath: 'logout',
      onClick: () => dispatch(auth.thunks.logout())
    },
  ];

  return (
    <div className={cn(
      styles.sidebar,
      className
    )}>
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
                'd-flex align-items-center',
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
