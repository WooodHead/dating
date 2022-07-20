import Router, { useRouter } from "next/router";
import cn from "classnames";
import styles from "./index.module.scss";
import { useDispatch } from "react-redux";
import { auth } from "store/auth/auth";
import IconHeart from "components/icons/IconHeart";

function Sidebar(
  {
    routeList = [
      {
        // eslint-disable-next-line react/display-name
        icon: (active) => <IconHeart size="sm" color={active ? '#355C7D' : 'transparent'} solid />,
        name: 'Main photos',
        basePath: 'account/photos/main-photos',
        onClick: () => Router.push('/account/photos/main-photos'),
      },
      {
        // eslint-disable-next-line react/display-name
        icon: (active) => <IconHeart size="sm" color={active ? '#355C7D' : 'transparent'} solid />,
        name: 'Public albums',
        basePath: 'account/photos/public-albums',
        onClick: () => Router.push('/account/photos/public-albums'),
      },
      {
        // eslint-disable-next-line react/display-name
        icon: (active) => <IconHeart size="sm" color={active ? '#355C7D' : 'transparent'} solid />,
        name: 'Private albums',
        basePath: 'account/photos/private-albums',
        onClick: () => Router.push('/account/photos/private-albums')
      },
    ]
  }
) {
  const router = useRouter();
  const dispatch = useDispatch();

  const routeActive = (basePath) => router.pathname.includes(basePath);

  return (
    <div className={styles.sidebar}>
      <div className={styles.list}>
        {routeList.map(item => (
          <div
            key={item.name}
            className={cn(
              styles['list-wrap'],
            )}
          >
            <div
              onClick={item.onClick}
              className={cn(
                styles['list__item'],
                'd-flex align-items-center',
                { [styles['list__item--active']]: routeActive(item.basePath) }
              )}
            >
              {item.icon(routeActive(item.basePath))}
              <div className="color-grey-600 text-md ml-1">{item.name}</div>
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
