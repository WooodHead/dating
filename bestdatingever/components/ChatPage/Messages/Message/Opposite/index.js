import Time from '../_shared/Time';
import MsgText from "../_shared/MsgText";
import cn from "classnames";
import messageStyles from "../_shared/index.module.scss";
import styles from "./index.module.scss";

function OppositeMessage({ message }) {
  return (
    <div className={styles['message-container']}>
      <div className={cn(messageStyles['text-block'], styles['text-block'])}>
        <MsgText message={message.message} />
      </div>
      <Time date={message.createdAt} />
    </div>
  );
}

export default OppositeMessage;
