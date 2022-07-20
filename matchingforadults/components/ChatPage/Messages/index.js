import { useEffect, useRef, useState } from "react";
import Message from "./Message"
import PinnedDate from './PinnedDate';
import { throttle } from 'utils/throttle';
import { useDispatch, useSelector } from "react-redux";
import { chatsRoom } from "store/chats/room";
import cn from 'classnames';
import styles from './index.module.scss';

function Messages() {
  const dispatch = useDispatch();
  const containerRef = useRef();
  const unreadMsgContainerRef = useRef();
  const [pinnedDate, setPinnedDate] = useState();
  const [pinnedNewMsg, setPinnedNewMsg] = useState(true);
  const listMsg = useSelector(chatsRoom.selectors.listMsg);
  const listUnreadMsg = useSelector(chatsRoom.selectors.listUnreadMsg);
  const listNewMsg = useSelector(chatsRoom.selectors.listNewMsg);
  const listOldMsg = useSelector(chatsRoom.selectors.listOldMsg);
  const listOldMsgStatus = useSelector(chatsRoom.selectors.listOldMsgStatus);
  const currentRoomId = useSelector(chatsRoom.selectors.currentRoomId);
  
  const scrollToBottom = () => {
    const containerEl = containerRef.current;
    containerEl.scrollTop = containerEl.scrollHeight - containerEl.offsetHeight; // TODO: check scroll sticky height
  };
  
  const scrollToUnreadMsg = () => {
    const containerEl = containerRef.current;
    const unreadMsgContainerEl = unreadMsgContainerRef.current;
    containerEl.scrollTop = containerEl.scrollHeight - unreadMsgContainerEl.offsetHeight - 75;
    // 75 - it's height new msg container
  };
  
  useEffect(() => {
    if (listUnreadMsg.length > 0) {
      scrollToUnreadMsg();
    } else {
      scrollToBottom();
    }
    onPinnedDate();
  }, []);
  
  useEffect(() => {
    const msgIsRead = list => {
      const messagesIds = [];
      
      list.forEach(msg => {
        if (!msg.isRead && msg.type === 'opposite') messagesIds.push(msg._id);
      });
      
      if (messagesIds.length > 0) {
        setTimeout(() => dispatch(chatsRoom.thunks.markAsRead(messagesIds)), 2000);
      } else {
        setPinnedNewMsg(false);
      }
    };
    
    if (listUnreadMsg.length > 0) msgIsRead(listUnreadMsg);
    if (listNewMsg.length > 0) msgIsRead(listNewMsg);
  }, [listUnreadMsg, listNewMsg]);
  
  useEffect(() => {
    if (listNewMsg.length > 0) {
      const scrollFromBottom = 300;
      const containerEl = containerRef.current;
      const userIsScrolling = (containerEl.scrollHeight - containerEl.offsetHeight - containerEl.scrollTop) > scrollFromBottom;
      
      if (!userIsScrolling) scrollToBottom();
    }
  }, [listNewMsg]);
  
  const onPinnedDate = () => {
    try {
      const containerEl = containerRef.current;
      const { bottom, left } = containerEl.getBoundingClientRect();
      const pickedEL = document.elementFromPoint(left + 20, bottom - 20);
      const messageEl = pickedEL.closest('[data-message-id]');
      
      const allMessages = [...listOldMsg, ...listMsg, ...listUnreadMsg, ...listNewMsg];
      const message = allMessages.find(message => message._id === messageEl.dataset.messageId);
      
      setPinnedDate(message.createdAt);
    } catch (e) {
      pinnedDate !== undefined && setPinnedDate(undefined)
    }
  };
  
  const onLoadOldMessages = async () => {
    const containerEl = containerRef.current;
    const roomMsgTop = containerEl.scrollTop === 0;
    
    if (roomMsgTop && listOldMsgStatus === 'success') {
      const prevScrollHeight = containerEl.scrollHeight;
      const scrolled = containerEl.scrollTop;
      
      await dispatch(chatsRoom.thunks.loadOldMessages());
      
      const newScrollHeight = containerEl.scrollHeight;
      containerEl.scrollTop = scrolled + newScrollHeight - prevScrollHeight;
    }
  };
  
  function handleContainerScroll() {
    if (!containerRef.current) return;
    
    onPinnedDate();
    onLoadOldMessages();
  }
  
  return (
    <div
      className={cn([styles.wrap, 'custom-scroll'])}
      ref={containerRef}
      onScroll={throttle(handleContainerScroll, 500)}
    >
      {!currentRoomId && (
        <div className={styles['no-messages']}>
          <img src="/img/chat/msg-send.png" alt="" className="mb-5"/>
          <div className={cn(styles['no-messages__text'], 'text-lg')}>
            No messages yet, start the conversation!
          </div>
        </div>
      )}
      <PinnedDate
        date={pinnedDate}
      />
      <div className={styles.messages}>
        {listOldMsg.map((message) => (
          <div className="pb-2" key={message._id} data-message-id={message._id}>
            <Message message={message}/>
          </div>
        ))}
        
        {listMsg.map((message) => (
          <div className="pb-2" key={message._id} data-message-id={message._id}>
            <Message message={message}/>
          </div>
        ))}
        
        {listUnreadMsg.length > 0 && (
          <div ref={unreadMsgContainerRef}>
            {pinnedNewMsg && (
              <div className={cn(styles['new-messages'], 'pb-2')}>
                <div className={cn(styles['new-messages__text'], 'px-2')}>
                  New messages
                </div>
              </div>
            )}
            {listUnreadMsg.map(message => (
              <div className="pb-2" key={message._id} data-message-id={message._id}>
                <Message message={message}/>
              </div>
            ))}
          </div>
        )}
        
        {listNewMsg.length > 0 && (
          listNewMsg.map(message => (
            <div className="pb-2" key={message._id} data-message-id={message._id}>
              <Message message={message}/>
            </div>
          )))
        }
      </div>
    </div>
  )
}

export default Messages;
