import SettingsList from "components/SettingsList";
import { useSelector } from "react-redux";
import { windowActions } from "store/windowActions";
import styles from "./index.module.scss";
import cn from "classnames";

function ProfileAside() {
  const asideIsOpen = useSelector(windowActions.selectors.asideIsOpen);
  
  return (
    <div className={cn(
      styles.aside,
      { [styles['aside--is-open']]: asideIsOpen }
    )}>
      <div className={styles['aside__bg']} />
      <div className={styles.content}>
        <SettingsList />
      </div>
    </div>
  );
}

export default ProfileAside;
