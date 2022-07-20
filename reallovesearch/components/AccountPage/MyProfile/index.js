import styles from "./index.module.scss";
import MobileSideBar from "../MobileSideBar";

function MyProfile({ children }) {
  return (
    <div className={styles.wrap}>
      <MobileSideBar />
      {children}
    </div>
  );
}

export default MyProfile;
