import styles from "./index.module.scss";
import cn from "classnames";
import IconClose from "../../icons/IconClose";
import Sidebar from "../Sidebar";
import { bodyOverflow, cancelOverflow } from "utils/helpers";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { mediaSizes } from "utils/constants";

function MobileSideBar({routeList}) {

  const router = useRouter()


  const [optionsIsVisible, setOptionsIsVisible] = useState(false);

  const toggleOptions = () => {
    setOptionsIsVisible(!optionsIsVisible);
    bodyOverflow(mediaSizes.lg);
  }

  const closeOptions = () => {
    setOptionsIsVisible(false);
    cancelOverflow();
  }

  useEffect(() => {
    router.events.on("routeChangeComplete",  closeOptions);

    return () => {
      router.events.off("routeChangeComplete", closeOptions);
    }
  }, [])


  return (
    <div className={styles.wrap}>
      <div className={styles['options-wrap']}>
        <div
          className={cn(
            styles.options,
            'd-inline-flex align-items-center cursor-pointer color-blue-900'
          )}
          onClick={toggleOptions}
        >
          <div>Options</div>
          <img
            src="/img/buttons/arrow.svg"
            alt=""
            className="ml-1"
          />
        </div>
        {optionsIsVisible && (
          <div className={styles['sidebar-mobile']}>
            <div className="container">
              <div
                className="d-flex justify-content-between align-items-center mt-4 mb-3"
                onClick={toggleOptions}
              >
                <div className={cn(
                  styles['sidebar-mobile__title'],
                  'd-inline-flex align-items-center text-semibold cursor-pointer'
                )}>
                  <div>Options</div>
                  <img
                    src="/img/buttons/arrow.svg"
                    alt=""
                    className="ml-1 rotate-180"
                  />
                </div>
                <div className="cursor-pointer">
                  <IconClose size="sm" color="#323B52" />
                </div>
              </div>
              <div className={styles['sidebar-mobile__options']}>
                  <Sidebar routeList={routeList} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MobileSideBar;
