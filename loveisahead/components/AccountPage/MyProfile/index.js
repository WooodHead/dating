import { useRouter } from "next/router";
import Tabs from "components/Tabs";
import styles from "./index.module.scss";
import cn from "classnames";
import MobileSideBar from "../MobileSideBar";

function MyProfile({ children }) {
  const router = useRouter();

  const tabs = [
    { value: '/account/profile/personal', name: 'Personal'},
    { value: '/account/profile/change-email', name: 'Change email'},
    { value: '/account/profile/change-phone', name: 'Change phone'},
    { value: '/account/profile/change-password', name: 'Change my password'}
  ];

  const handleTabChange = (value) => {
    router.push(value)
  };

  return (
    <div className={styles.wrap}>
      <div className={cn(
        styles.title,
        'text-xl mb-5 mt-2'
      )}>
        My account
      </div>
      <MobileSideBar />
      <div className={cn(
        styles.tabs,
        'mb-4'
      )}>
        <Tabs
          tabs={tabs}
          tabActive={router.pathname}
          onChange={handleTabChange}
        />
      </div>
      {children}
    </div>
  );
}

export default MyProfile;
