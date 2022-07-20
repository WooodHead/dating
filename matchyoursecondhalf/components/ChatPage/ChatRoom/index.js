import ChatHead from "../Head";
import ChatMessages from "../Messages";
import ChatPanel from "../Panel";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { chatsRoom } from "store/chats/room";
import Loader from "components/Loader";
import styles from "./index.module.scss";

function ChatRoom() {
  const dispatch = useDispatch();
  const currentRoomId = useSelector(chatsRoom.selectors.currentRoomId);
  const listMsgStatus = useSelector(chatsRoom.selectors.listMsgStatus);
  
  useEffect(() => {
    if (currentRoomId === undefined || currentRoomId === null) return
    dispatch(chatsRoom.thunks.getMessages());
  }, []);
  
  if (currentRoomId && ['idle', 'pending'].includes(listMsgStatus)) {
    return (
      <div className={styles.loader}>
        <Loader/>
      </div>
    );
  }
  
  return (
    <div className={styles.room}>
      <ChatHead/>
      <ChatMessages/>
      <ChatPanel/>
    </div>
  );
}

export default ChatRoom;
