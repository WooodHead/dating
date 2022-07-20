import styles from "./index.module.scss";

function Title() {
  return (
    <div className={styles.wrap}>
      <div className="title-xs text-medium">
        Messages
      </div>
      {/*<img src="/img/chat/icon-search.svg" alt="" />*/}
    </div>
  );
}

export default Title;
