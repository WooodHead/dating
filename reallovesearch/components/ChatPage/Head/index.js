import Avatar from "components/Avatar";
import Actions from "./Actions";
import { useDispatch, useSelector } from "react-redux";
import { chatsRoom } from "store/chats/room";
import styles from "./index.module.scss";
import IconArrowBack from "components/icons/IconArrowBack";
import { useRouter } from "next/router";
import cn from "classnames";

function Head() {
  const roomUserProfile = useSelector(chatsRoom.selectors.profile);
  const currentRoomId = useSelector(chatsRoom.selectors.currentRoomId);
  const currentRoomConfig = useSelector(chatsRoom.selectors.currentRoomConfig);
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
          'd-flex align-items-center cursor-pointer mb-2'
        )}
        onClick={backToListChats}
      >
        <IconArrowBack/>
        <div className="color-grey-700 text-lg ml-1">Back to chat list</div>
      </div>
      <div className={styles.wrap}>
        <div className={styles.user}>
          <Avatar
            className={styles['user__avatar']}
            thumb={roomUserProfile.avatarPath}
            name={roomUserProfile.name}
          />
          <div className>
            <div className="text-lg text-semibold">{roomUserProfile.name}</div>
            <div className="d-flex align-items-center">
              <div className={cn(
                styles[`user__status-${userStatus}`],
                'text-italic'
              )}>
                {userStatus}
              </div>
              {currentRoomConfig.isMute && (
                <img
                  src="/img/chat/icon-mute.svg"
                  alt=""
                  className="ml-2"
                />
              )}
            </div>

          </div>
        </div>
        {currentRoomId && <Actions/>}
      </div>
    </>
  );
}

export default Head;
