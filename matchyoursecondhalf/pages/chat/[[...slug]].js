import MainLayout from "layouts/Main";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { chatsRoom } from "store/chats/room";
import { chats } from "store/chats";

const ChatList = dynamic(() => import('components/ChatPage/ListChats'), { ssr: false });

ChatPage.layouts = [{
  component: MainLayout,
  props: { disableYOffset: true }
}];

function ChatPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(chats.actions.RESET_STATE());
      dispatch(chatsRoom.actions.RESET_STATE());
    };
  }, []);

  return <ChatList/>;
}

export default ChatPage;
