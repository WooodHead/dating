import { useEffect, useRef, useState } from "react";
import Title from "./Title"
import Chat from "./Chat"
import Tabs from "components/Tabs"
import Loader from "components/Loader";
import ListEmpty from "components/ListEmpty";
import { useDispatch, useSelector } from "react-redux";
import { chats } from "store/chats";
import { throttle } from "utils/throttle";
import cn from "classnames"
import styles from "./index.module.scss";

const tabs = [
  { value: 'active', name: 'All conversations' },
  { value: 'archived', name: 'Archived' },
]

function Sidebar() {
  const [activeTab, setActiveTab] = useState('active');
  const sidebarRef = useRef();
  const dispatch = useDispatch();
  const chatsList = useSelector(chats.selectors.list);
  const chatsListStatus = useSelector(chats.selectors.listStatus);
  const chatsListMoreStatus = useSelector(chats.selectors.chatsListMoreStatus);
  
  const getChats = (params = {}) => {
    dispatch(chats.thunks.getChats(params));
  };
  
  useEffect(() => {
    getChats();
  }, []);
  
  const onChangeTab = async (value) => {
    await setActiveTab(value);
    await dispatch(chats.actions.RESET_STATE());
    if (value === 'active') getChats();
    else getChats({ isArchived: true });
  };
  
  const loadMoreChats = () => {
    const sidebarEl = sidebarRef.current;
    const sidebarBottom = (sidebarEl.scrollHeight - sidebarEl.offsetHeight) === sidebarEl.scrollTop;
    
    if (sidebarBottom && chatsListMoreStatus === 'success') {
      dispatch(chats.thunks.getChatsMore());
    }
  };
  
  return (
    <div className={styles.wrap}>
      <div className={styles.content}>
        <Title/>
        <Tabs
          tabs={tabs}
          tabActive={activeTab}
          onChange={(value) => onChangeTab(value)}
        />
        <div
          className={cn([styles.chats, 'custom-scroll'])}
          ref={sidebarRef}
          onScroll={throttle(loadMoreChats, 500)}
        >
          {chatsListStatus === 'pending' ? (
            <div className="py-2">
              <Loader size="sm"/>
            </div>
          ) : (
            chatsList.length > 0 ? (
              <>
                {chatsList.map(chat => <Chat key={chat._id} chat={chat}/>)}
                {chatsListMoreStatus === 'pending' && (
                  <div className="py-2">
                    <Loader size="sm"/>
                  </div>
                )}
              </>
            ) : (
              <div className="py-2">
                <ListEmpty text="No results"/>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
