import ChatSidebar from "../Sidebar";
import ChatRoom from "../ChatRoom";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { chatsRoom } from "store/chats/room";
import { auth } from "store/auth/auth";
import initChatSocket from "api/sockets/initChat";
import cn from "classnames";
import styles from "./index.module.scss";

function ListChats() {
  const router = useRouter();
  const roomId = router.query.slug;
  const dispatch = useDispatch();
  const [roomIsVisible, setRoomIsVisible] = useState(false);
  const jwtToken = useSelector(auth.selectors.jwtToken);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    if (roomId === undefined || roomId === null) {
      setRoomIsVisible(false);
      return
    }
    
    const initRoom = async (roomId) => {
      setRoomIsVisible(false);
      await dispatch(chatsRoom.actions.SET_ROOM_ID(roomId));
      setRoomIsVisible(true);
    };
    
    if (roomId.length > 0) {
      initRoom(roomId[0]);
    } else {
      setRoomIsVisible(true);
    }
  }, [roomId]);
  
  useEffect(() => {
    const chatSocket = new initChatSocket({ jwtToken });
    chatSocket.init();
    chatSocket.connectToRoom();
    
    return () => chatSocket.socketDisconnect();
  }, []);
  
  const listChatDesktop = (
    <div className={styles.wrap}>
      <ChatSidebar/>
      {roomIsVisible ? (
        <ChatRoom/>
      ) : (
        <div className={styles.main}>
          <div className={cn(styles.text, 'text-lg')}>
            Select a chat to start messaging
          </div>
        </div>
      )}
    </div>
  )
  
  const listChatMobile = (
    <>
      <div className={cn(
        styles['mobile-chat__sidebar'],
        { [styles['mobile-chat__sidebar--active']]: !roomId && !roomIsVisible }
      )}>
        <ChatSidebar/>
      </div>
      
      {roomIsVisible && (
        <div className={styles['mobile-chat__room']}>
          <ChatRoom/>
        </div>
      )}
    </>
  )
  
  return !isMobile ? listChatDesktop : listChatMobile
}

export default ListChats;
