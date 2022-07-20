import MobileSideBar from "../MobileSideBar";
import styles from "./index.module.scss";

function MyPhotos({ children }) {
  return (
    <div className={styles.wrap}>
      <MobileSideBar />
      {children}
    </div>
  );
}

export default MyPhotos;
