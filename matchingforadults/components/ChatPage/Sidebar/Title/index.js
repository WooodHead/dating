import styles from "./index.module.scss";

function Title() {
  return (
    <div className={styles.wrap}>
      <div className="title-xs text-bold text-palatino mr-2">
        Chat
      </div>
      {/*<img src="/img/chat/icon-search.svg" alt="" className="icon-default"/>*/}
    </div>
  );
}

export default Title;
