import Time from '../_shared/Time';
import MsgText from "../_shared/MsgText";
import cn from "classnames";
import messageStyles from "../_shared/index.module.scss";
import styles from "./index.module.scss"

function OwnMessage({ message }) {
  return (
    <div className={styles['message-container']}>
      <div className={cn(messageStyles['text-block'], styles['text-block'])}>
        <MsgText message={message.message}/>
      </div>
      <div className={styles.footer}>
        <Time date={message.createdAt}/>
        <img src={message.isRead ? '/img/chat/icon-check-double.svg' : '/img/chat/icon-check-single.svg'}/>
      </div>
    </div>
  );
}

export default OwnMessage;
