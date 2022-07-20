import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chatsRoom } from "store/chats/room";
import OutsideAlerter from 'hooks/ClickOutside';
import PopupConfirm from "components/Popups/PopupConfirm";
import styles from "./index.module.scss";

function Actions() {
  const dispatch = useDispatch();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [popupConfirmIsVisible, setPopupConfirmIsVisible] = useState(false);
  const currentRoomConfig = useSelector(chatsRoom.selectors.currentRoomConfig);
  const removeChatStatus = useSelector(chatsRoom.selectors.removeChatStatus);
  const currentRoomProfile = useSelector(chatsRoom.selectors.profile);
  
  const onMuteChat = () => {
    dispatch(chatsRoom.thunks.muteChat());
  };
  
  const onArchiveChat = () => {
    dispatch(chatsRoom.thunks.archiveChat());
  };
  
  const onRemoveChat = async () => {
    dispatch(chatsRoom.thunks.removeChat());
  };
  
  return (
    <div className={styles.wrap}>
      <img
        className={styles.switcher}
        src="/img/chat/icon-dots.svg"
        onClick={() => setMenuIsOpen(true)}
      />
      
      {menuIsOpen && (
        <OutsideAlerter close={() => setMenuIsOpen(false)}>
          <div className={styles.menu}>
            <div className={styles['menu__item']} onClick={onMuteChat}>
              {currentRoomConfig.isMute ? 'Unmute the chat' : 'Mute the chat'}
            </div>
            <div className={styles['menu__item']} onClick={onArchiveChat}>
              {currentRoomConfig.isArchived ? 'De-archived the chat' : 'Archive the chat'}
            </div>
            <div className={styles['menu__item']} onClick={() => setPopupConfirmIsVisible(true)}>
              Remove chat
            </div>
          </div>
        </OutsideAlerter>
      )}
      
      {popupConfirmIsVisible && (
        <PopupConfirm
          dark
          onClose={() => setPopupConfirmIsVisible(false)}
          onConfirm={onRemoveChat}
          onCancel={() => setPopupConfirmIsVisible(false)}
          loader={removeChatStatus === 'pending'}
        >
          Are you sure that you want to delete the chat with {currentRoomProfile.name}?
        </PopupConfirm>
      )}
    </div>
  );
}

export default Actions;
