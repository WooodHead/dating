import { useRouter } from "next/router";
import { useState } from "react";
import IconButton from "components/IconButton";
import IconClose from "components/icons/IconClose";
import IconChevron from "components/icons/IconChevron";
import { bodyOverflow, cancelOverflow } from "utils/helpers";
import cn from "classnames";
import styles from "./index.module.scss";

function TopbarMenu({ routeList }) {
  const router = useRouter();
  
  const routeActive = (basePath) => router.pathname.includes(basePath);
  
  const [listIsVisible, setListIsVisible] = useState(false);
  
  return (
    <>
      <div
        className={styles.options}
        onClick={() => {
          setListIsVisible(true);
          bodyOverflow(576);
        }}
      >
        <span>Options</span>
        <IconChevron className="rotate-270 ml-1"/>
      </div>
      <div className={cn(
        styles.list,
        { [styles['list--is-visible']]: listIsVisible },
      )}>
        {listIsVisible && (
          <IconButton className={styles['btn-close']} onClick={() => {
            setListIsVisible(false);
            cancelOverflow();
          }}>
            <IconClose color="#4B5064" />
          </IconButton>
        )}
        {routeList.map(item => (
          <div
            key={item.name}
            className={cn(
              styles['list__item'],
              { [styles['list__item--active']]: routeActive(item.basePath) },
              'text-uppercase'
            )}
            onClick={() => router.push(item.link)}
          >
            {item.name}
          </div>
        ))}
      </div>
    </>
  );
}

export default TopbarMenu;
