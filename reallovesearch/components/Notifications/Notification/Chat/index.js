import IconButton from "components/IconButton";
import IconClose from "components/icons/IconClose";
import Avatar from "components/Avatar";
import { useRouter } from "next/router";
import cn from "classnames";
import styles from "../_shared/index.module.scss";

function ChatNotification(
  {
    idx,
    notification,
    onDelete = () => {},
    onClose = () => {},
  }
) {
  const router = useRouter();
  
  const goToChat = async () => {
    await router.push({
      pathname: '/chat/[[...slug]]',
      query: { slug: notification.chatLink },
    });
    onClose();
  };
  
  const deleteNotification = (e) => {
    e.stopPropagation();
    onDelete(notification._id)
  };
  
  return (
    <div
      className={cn(
        styles.notification,
        styles[`cascade--order-${idx + 1}`],
        'text-md'
      )}
      onClick={goToChat}
    >
      <IconButton
        className={styles['icon-close']}
        onClick={deleteNotification}
      >
        <IconClose color="#FFFFFF"/>
      </IconButton>
      <div className="d-flex align-items-start">
        <Avatar
          className="mr-1"
          name={notification.profile.name}
          thumb={notification.profile.avatarPath}
          isOnline={notification.profile.online}
        />
        <div className="color-white">
          <div className={cn(styles.title, 'text-bold')}>New message from chat</div>
          <div>{notification.profile.name} sent you a new message</div>
        </div>
      </div>
    </div>
  );
}

export default ChatNotification;
