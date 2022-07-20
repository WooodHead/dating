import Avatar from "components/Avatar";
import Actions from "./Actions";
import IconArrowBack from "components/icons/IconArrowBack";
import { useDispatch, useSelector } from "react-redux";
import { chatsRoom } from "store/chats/room";
import { useRouter } from "next/router";
import cn from "classnames";
import styles from "./index.module.scss";

function Head() {
  const roomUserProfile = useSelector(chatsRoom.selectors.profile);
  const currentRoomId = useSelector(chatsRoom.selectors.currentRoomId);
  const userStatus = roomUserProfile.online ? 'online' : 'offline';
  const router = useRouter();
  const dispatch = useDispatch();
  
  const backToListChats = async () => {
    await router.push('/chat');
    dispatch(chatsRoom.actions.RESET_ROOM_ID());
  };
  
  return (
    <>
      <div
        className={cn(
          styles.back,
          'd-flex align-items-center cursor-pointer'
        )}
        onClick={backToListChats}
      >
        <IconArrowBack />
        <div className="color-grey-700 text-lg ml-1">Back to chat list</div>
      </div>
      <div className={styles.wrap}>
        <div className={styles.user}>
          <Avatar
            className={styles['user__avatar']}
            thumb={roomUserProfile.avatarPath}
            name={roomUserProfile.name}
            size="lg"
          />
          <div className="text-lg ml-1">
            <div>{roomUserProfile.name}</div>
            <div className={styles[`user__status-${userStatus}`]}>
              {userStatus}
            </div>
          </div>
        </div>
        {currentRoomId && <Actions />}
      </div>
    </>
  );
}

export default Head;
