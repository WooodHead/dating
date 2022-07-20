import { useState } from 'react';
import { useRouter } from "next/router";
import Tabs from "components/Tabs";
import styles from "./index.module.scss";

function MyProfile({ children }) {
  const router = useRouter();

  const tabs = [
    { value: '/account/settings/change-email', name: 'Change email'},
    { value: '/account/settings/change-password', name: 'Change my password'},
    { value: '/account/settings/change-phone', name: 'Change phone'},
    { value: '/account/settings/notifications', name: 'Notification'}
  ]

  const handleTabChange = (value) => {
    router.push(value)
  }

  return (
    <div className={styles.wrap}>
      <div className="title-xs text-semibold color-blue-900 mb-5">
        Settings
      </div>
      <div className="mb-4">
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
