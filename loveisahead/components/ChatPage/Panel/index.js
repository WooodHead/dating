import dynamic from 'next/dynamic';
import { useState, useRef } from "react";
import OutsideAlerter from 'hooks/ClickOutside';
import TextareaAutosize from 'react-textarea-autosize';
import IconSend from 'components/icons/IconSend';
import { chatsRoom } from "store/chats/room";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "store/user/profile";
import PopupNotification from "components/Popups/PopupNotification";
import Link from "next/link";
import cn from "classnames";
import styles from "./index.module.scss";

const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

function Panel() {
  const [emojiPickerIsOpen, setEmojiPickerIsOpen] = useState(false);
  const emojiSwitcherRef = useRef(null);
  const messageCompleterRef = useRef(null);
  const textareaRef = useRef(null);
  const textareaSelectionRange = useRef([0, 0]);
  const [textareaValue, setTextareaValue] = useState('');
  const dispatch = useDispatch();
  const roomUserProfile = useSelector(chatsRoom.selectors.profile);
  const roomUserRelation = useSelector(chatsRoom.selectors.relation);
  const listMsg = useSelector(chatsRoom.selectors.listMsg);
  const listNewMsg = useSelector(chatsRoom.selectors.listNewMsg);
  const profile = useSelector(userProfile.selectors.profile);

  const [popupNotification, setPopupNotification] = useState(false);

  const handleTextareaInput = (e) => {
    const val = e.target.value.replace(/^ +| +$/gm, "");
  
    if (val.length > 0) setTextareaValue(e.target.value);
    else setTextareaValue('');
  };
  
  const updateTextareaSelectionRange = () => {
    if (textareaRef.current === null) return
    textareaSelectionRange.current = [textareaRef.current.selectionStart, textareaRef.current.selectionEnd];
  };

  const handleOpenEmojiPicker = () => {
    setEmojiPickerIsOpen(!emojiPickerIsOpen);
  };

  const handleOpenCompleteMessages = () => {
    if (!profile.isPremiumUser) dispatch(userProfile.actions.TOGGLE_POPUP(true));
  };
  
  const handleEmojiClick = (e, { emoji }) => {
    const [startIndex, endIndex] = textareaSelectionRange.current;
    setTextareaValue(textareaValue.slice(0, startIndex) + emoji + textareaValue.slice(endIndex));
  };
  
  const onSubmitMsg = async () => {
    if (roomUserRelation.blockedTo || roomUserRelation.blockedFrom) {
      setPopupNotification(true);
      return
    }

    if (!profile.isPremiumUser && listMsg.length > 0 || !profile.isPremiumUser && listNewMsg.length > 0) {
      dispatch(userProfile.actions.TOGGLE_POPUP(true));
      return
    }

    const { payload } = await dispatch(chatsRoom.thunks.sendMessage(textareaValue));
    
    if (payload?.message_status === 'Send') setTextareaValue('');
    if (payload?.statusCode === 403) setPopupNotification(true);
  };
  
  const onEnterSubmit = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      if (textareaValue.length > 0) onSubmitMsg();
    }
  
    if (e.keyCode == 13 && e.shiftKey == true && textareaValue <= 0) {
      e.preventDefault()
    }
  };
  
  return (
    <>
      <div className={styles.wrap}>
        <div className={styles.field}>
          <TextareaAutosize
            className={cn([styles['field__textarea'], 'custom-scroll'])}
            placeholder="Write your message..."
            rows={1}
            maxRows={3}
            ref={textareaRef}
            value={textareaValue}
            onInput={handleTextareaInput}
            onBlur={updateTextareaSelectionRange}
            onKeyDown={onEnterSubmit}
          />
          
          <img
            src="/img/chat/icon-autocomplete.svg"
            className={styles['field__emoji-complete']}
            onClick={handleOpenCompleteMessages}
            ref={messageCompleterRef}
          />

          <img
            src="/img/chat/icon-smile.svg"
            className={styles['field__emoji-switcher']}
            onClick={handleOpenEmojiPicker}
            ref={emojiSwitcherRef}
          />
          
          {emojiPickerIsOpen && (
            <OutsideAlerter
              close={() => setEmojiPickerIsOpen(false)}
              extraRefs={[emojiSwitcherRef]}
            >
              <div className={styles['field__emoji-picker']}>
                <Picker onEmojiClick={handleEmojiClick}/>
              </div>
            </OutsideAlerter>
          )}
        </div>
        
        <div
          className={cn(
            styles['send-btn'],
            { [styles['send-btn--disabled']]: !textareaValue.length }
          )}
          onClick={onSubmitMsg}
        >
          <IconSend color={!textareaValue.length ? '#AAAEB8' : undefined}/>
        </div>
      </div>
      
      {popupNotification && (
        <PopupNotification onClose={() => setPopupNotification(false)}>
          {roomUserRelation.blockedTo ? (
            <>
              {roomUserProfile.name} was blocked. You can unblock him/her by clicking Unblock button on &nbsp;
              <Link href={`/profile/${roomUserProfile.user}`}>
                <a className="color-gold-400 text-underline-link">{roomUserProfile.name}'s Profile page</a>
              </Link>
            </>
          ) : (
            'You were blocked by this user'
          )}
        </PopupNotification>
      )}
    </>
  );
}

export default Panel;
