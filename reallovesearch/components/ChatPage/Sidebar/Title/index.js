// import cn from "classnames";
import styles from "./index.module.scss";
import cn from "classnames";

function Title() {
  return (
    <div className={styles.wrap}>
      <div className={cn(
        styles.title,
        'text-xl text-poppins text-medium color-blue-900 mr-2'
      )}>
        CHAT
      </div>
      {/*<div className={cn(['circle', styles['unread-count']])}>2</div>*/}
    </div>
  );
}

export default Title;
