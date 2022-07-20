import Sidebar from "components/AccountPage/Sidebar";
import MobileSideBar from "components/AccountPage/MobileSideBar";
import styles from './index.module.scss'
import cn from "classnames";

function MySubscription({children}) {
  return (
    <div className="d-flex">
      <div className={styles.sidebar}>
        <Sidebar/>
      </div>
      <div className={styles.content}>
        <MobileSideBar/>
        <div className={styles.wrap}>
          <p className={cn(
            styles.title,
            'text-xl mt-2 text-bold'
          )}>My subscription</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export default MySubscription;
