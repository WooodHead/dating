import Sidebar from "components/AccountPage/Sidebar";
import MobileSideBar from "components/AccountPage/MobileSideBar";
import styles from './index.module.scss'
import cn from "classnames";
import IconHeart from "components/icons/IconHeart";
import Router from "next/router";

function MySubscription({children}) {
  const routeList = [
    {
      // eslint-disable-next-line react/display-name
      icon: (active) => <IconHeart size="sm" color={active ? '#355C7D' : 'transparent'} solid />,
      name: 'My Subscription',
      basePath: 'account/subscription',
      onClick: () => Router.push('/account/subscription'),
    },
    {
      // eslint-disable-next-line react/display-name
      icon: (active) => <IconHeart size="sm" color={active ? '#355C7D' : 'transparent'} solid />,
      name: 'Transactions',
      basePath: 'account/transactions',
      onClick: () => Router.push('/account/transactions'),
    }
  ]

  return (
    <div className="d-flex">
      <div className={styles.sidebar}>
        <Sidebar routeList={routeList}/>
      </div>
      <div className={styles.content}>
        <MobileSideBar routeList={routeList}/>
        <div className={styles.wrap}>
          <p className={cn(
            styles.title,
            'title-xs text-semibold mb-5 color-blue-900'
          )}>My subscription</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export default MySubscription;
