import { useEffect, useRef, useState } from "react";
import Title from "./Title"
import Chat from "./Chat"
import Tabs from "components/Tabs"
import { useDispatch, useSelector } from "react-redux";
import { chats } from "store/chats";
import { chatsRoom } from "store/chats/room";
import Loader from "components/Loader";
import ListEmpty from "components/ListEmpty";
import { throttle } from "utils/throttle";
import cn from "classnames"
import styles from "./index.module.scss";
import TextField from "components/Form/TextField";

const tabs = [
  { value: 'active', name: 'All conversations' },
  { value: 'archived', name: 'Archived' },
]

function Sidebar() {
  const [activeTab, setActiveTab] = useState('active');
  const [search, setSearch] = useState(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
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

  const searchingChats = () => {
    if(!search) {
      return chatsList
    }

    return chatsList.filter((item) => item.profile.name.toLowerCase().includes(search.toLowerCase()));
  }
  
  return (
    <div className={styles.wrap}>
      <div className={styles.bg}/>
      <div className={styles.content}>
        <div className="mb-2">
          <div className={cn(
            styles['title-wrap'],
            'd-flex justify-content-between align-items-center pb-2'
          )}>
            <Title/>
          </div>
          <div className={styles['field-wrap']}>
            <TextField
              name="searchChat"
              value={search}
              placeholder="Type to search"
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              iconFront={<img src="/img/chat/search.svg" alt=""/>}
            />
          </div>
        </div>
        <Tabs
          className="mb-4 mb-sm-2"
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
            <Loader size="sm"/>
          ) : (
            searchingChats().length > 0 ? (
              <>
                {searchingChats().map(chat => <Chat key={chat._id} chat={chat}/>)}
                {chatsListMoreStatus === 'pending' && (
                  <div className="py-1">
                    <Loader size="sm"/>
                  </div>
                )}
              </>
            ) : (
              <ListEmpty text="No results"/>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
