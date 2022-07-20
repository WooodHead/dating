// import cn from "classnames";
import styles from "./index.module.scss";

function Title() {
  return (
    <div className={styles.wrap}>
      <div className="title-sm text-semibold text-gilroy text-italic mr-2">
        Messages
      </div>
      {/*<div className={cn(['circle', styles['unread-count']])}>2</div>*/}
    </div>
  );
}

export default Title;
