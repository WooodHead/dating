import Time from '../_shared/Time';
import MsgText from "../_shared/MsgText";
import Avatar from "components/Avatar";
import { useSelector } from "react-redux";
import { userProfile } from "store/user/profile";
import cn from "classnames";
import messageStyles from "../_shared/index.module.scss";
import styles from "./index.module.scss"

function OwnMessage({ message }) {
  const profile = useSelector(userProfile.selectors.profile);
  
  return (
    <div className={styles['message-container']}>
      <div>
        <div className={cn(messageStyles['text-block'], styles['text-block'])}>
          <MsgText message={message.message}/>
        </div>
        <div className={styles.footer}>
          <Time date={message.createdAt}/>
          <img src={message.isRead ? '/img/chat/icon-check-double.svg' : '/img/chat/icon-check-single.svg'}/>
        </div>
      </div>
      <Avatar
        className="ml-1"
        thumb={profile.smAvatarPath}
        name={profile.name}
        size="xs"
      />
    </div>
  );
}

export default OwnMessage;
