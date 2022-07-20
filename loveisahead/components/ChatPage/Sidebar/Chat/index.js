import Avatar from "components/Avatar";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from "react-redux";
import { chatsRoom } from "store/chats/room";
import cn from "classnames";
import styles from "./index.module.scss";

function Chat({ chat }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentRoomId = useSelector(chatsRoom.selectors.currentRoomId);
  const roomsIdsAreSimilar = chat.chatLink === currentRoomId;
  
  const handleRoom = async () => {
    if (roomsIdsAreSimilar) return
    await dispatch(chatsRoom.actions.RESET_STATE());
    router.push({
      pathname: '/chat/[[...slug]]',
      query: { slug: chat.chatLink },
    });
  };
  
  return (
    <div
      className={cn(
        styles.wrap,
        { [styles['wrap--active']]: roomsIdsAreSimilar }
      )}
      onClick={handleRoom}
    >
      <Avatar
        className={styles.avatar}
        thumb={chat.profile.avatarPath}
        name={chat.profile.name}
        isOnline={chat.profile.online}
      />
      
      <div className={styles['text-content']}>
        <span className="text-bold text-md">{chat.profile.name}</span>
        <span className={styles['message-text']}>{chat.lastMessage.message}</span>
      </div>
      
      <div className={styles.aside}>
        <span className={styles['message-date']}>
          {chat.lastMessage.createdAt}
        </span>
        <span className="d-flex align-items-center justify-content-end">
          {chat.config.isMute && (
            <img
              src="/img/chat/icon-mute.svg"
              alt=""
              className="icon-default"
            />
          )}
          {chat.unreadMessagesCount > 0 && (
            <span
              className={cn(
                styles['unread-count'],
                'circle ml-2',
                { 'circle--wide': chat.unreadMessagesCount > 99 }
              )}
            >
            {chat.unreadMessagesCount > 99 ? '99+' : chat.unreadMessagesCount}
          </span>
          )}
        </span>
      </div>
    </div>
  );
}

export default Chat;
