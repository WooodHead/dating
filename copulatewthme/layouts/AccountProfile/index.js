import Sidebar from "components/AccountPage/Sidebar";
import MyProfile from "components/AccountPage/MyProfile";
import styles from './index.module.scss'

function AccountProfileLayout({children}) {
  return (
    <div className="d-flex">
      <div className={styles.sidebar}>
        <Sidebar/>
      </div>
      <MyProfile>
        {children}
      </MyProfile>
    </div>
  );
}

export default AccountProfileLayout;
