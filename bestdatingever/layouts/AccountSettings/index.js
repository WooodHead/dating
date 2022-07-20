import TopbarMenu from "components/AccountPage/TopbarMenu";
import styles from "./index.module.scss";

function AccountSettings({ children }) {
  const routeList = [
    {
      id: 1,
      name: 'Change email',
      basePath: '/settings/change-email',
      link: '/settings/change-email',
    },
    {
      id: 2,
      name: 'Change password',
      basePath: '/settings/change-password',
      link: '/settings/change-password',
    },
    {
      id: 3,
      name: 'Change phone',
      basePath: '/settings/change-phone',
      link: '/settings/change-phone',
    },
    {
      id: 4,
      name: 'Notifications',
      basePath: '/settings/notifications',
      link: '/settings/notifications',
    },
  ];

  return (
    <div className={styles.wrap}>
      <div className="mb-4">
        <TopbarMenu routeList={routeList} />
      </div>
      {children}
    </div>
  );
}

export default AccountSettings;
