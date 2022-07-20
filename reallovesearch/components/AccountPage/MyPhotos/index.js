import styles from "./index.module.scss";
import MobileSideBar from "../MobileSideBar";

function MyPhotos({ children }) {
  return (
    <div className={styles.wrap}>
      <MobileSideBar />
      {children}
    </div>
  );
}

export default MyPhotos;
