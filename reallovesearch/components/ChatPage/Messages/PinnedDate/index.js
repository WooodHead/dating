import Loader from "components/Loader";
import { formatRelative, isValid } from 'date-fns';
import { useSelector } from "react-redux";
import { chatsRoom } from "store/chats/room";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";

const ms = 1000;

// eslint-disable-next-line react/display-name
const PinnedDate = ({ date }) => {
  const listOldMsgStatus = useSelector(chatsRoom.selectors.listOldMsgStatus);
  const [dateIsVisible, setDateIsVisible] = useState(true);
  
  useEffect(() => {
    let timeout = null;
    
    if (listOldMsgStatus === 'pending') {
      timeout = setTimeout(() => setDateIsVisible(false), ms);
    }
    
    return () => {
      clearInterval(timeout);
      setDateIsVisible(true);
    };
  }, [listOldMsgStatus]);
  
  const parseDate = new Date(date);
  
  if (!isValid(parseDate)) return null
  
  return (
    <div className={styles.wrap}>
      {dateIsVisible ? formatRelative(parseDate, new Date()).split('at')[0] : <Loader size="xs"/>}
    </div>
  );
}

export default PinnedDate;
