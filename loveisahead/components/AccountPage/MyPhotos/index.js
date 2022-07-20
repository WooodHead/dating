import styles from "./index.module.scss";
import cn from "classnames";
import MobileSideBar from "../MobileSideBar";
import { cancelOverflow } from "utils/helpers";
import { useEffect } from "react";

function MyPhotos({ children }) {

  useEffect(() => {
    return () => {
      cancelOverflow()
    }
  }, [])


  return (
    <div className={styles.wrap}>
      <div className={cn(
        styles.title,
        'text-xl mb-5 mt-2'
      )}>
        My account
      </div>
      <MobileSideBar />
      {children}
    </div>
  );
}

export default MyPhotos;
