// import cn from "classnames";
import styles from "./index.module.scss";
import cn from "classnames";

function Title() {
  return (
    <div className={styles.wrap}>
      <div className={cn(
        styles.title,
        'title-xs text-semibold mr-2'
      )}>
        Messages
      </div>
      {/*<div className={cn(['circle', styles['unread-count']])}>2</div>*/}
    </div>
  );
}

export default Title;
