import Sidebar from "components/AccountPage/Sidebar";
import MyPhotos from "components/AccountPage/MyPhotos";
import styles from './index.module.scss'

function AccountPhotosLayout({children}) {
  return (
    <div className="d-flex">
      <div className={styles.sidebar}>
        <Sidebar/>
      </div>
      <MyPhotos>
        {children}
      </MyPhotos>
    </div>
  );
}

export default AccountPhotosLayout;
