import { createSlice } from "@reduxjs/toolkit";
import { thunks } from "./thunks";
import { thunks as chatsRoomThunks } from "store/chats/room/thunks";
import { selectors } from "./selectors";
import Chat from "resources/Chats/Chat";
import { formattedDateForChat } from "utils/preps";
import { changingUserDataWhoOnline } from "utils/userActions";
import { usersOnline } from "store/online";
import Router from "next/router";

const { HANDLE_USER } = usersOnline.actions;

const initialState = {
  list: [],
  listPag: {
    current: 20,
    take: 20,
    offset: 0,
  },
  listStatus: 'idle',
  chatsListMoreStatus: 'idle',
  socketStatus: 'idle',
};

export const slice = createSlice({
  name: 'chats',
  initialState: { ...initialState },
  reducers: {
    RESET_STATE: () => initialState,
    SET_SOCKET_STATUS: (state, { payload }) => {
      state.socketStatus = payload;
    },
    SET_NEW_MSG: (state, { payload }) => {
      const chatIdx = state.list.findIndex(chat => chat.chatLink === payload.chatLink);
      if (chatIdx !== -1) {
        state.list[chatIdx].lastMessage.createdAt = formattedDateForChat(payload.createdAt);
        state.list[chatIdx].lastMessage.message = payload.message;
        state.list[chatIdx].unreadMessagesCount += 1;
      }
    },
    CREATE_ROOM: (state, { payload }) => {
      const newChat = new Chat(payload);
      state.list.unshift(newChat.getChat());
    },
    DELETE_ROOM: (state, { payload }) => {
      const chatIdx = state.list.findIndex(chat => chat.chatLink === payload.chatLink);
      if (chatIdx !== -1) state.list.splice(chatIdx, 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(thunks.getChats.pending, (state) => {
        state.listStatus = 'pending';
      })
      .addCase(thunks.getChats.fulfilled, (state, { payload }) => {
        state.list = payload?.map(chat => {
          const newChat = new Chat(chat);
          return newChat.getChat();
        });
        state.listPag = {
          ...state.listPag,
          offset: state.listPag.offset + state.listPag.current,
        };
        state.listStatus = 'success';
        state.chatsListMoreStatus = 'success';
      })
      .addCase(thunks.getChats.rejected, (state) => {
        state.listStatus = 'fail';
      })
      
      .addCase(thunks.getChatsMore.pending, (state) => {
        state.chatsListMoreStatus = 'pending';
      })
      .addCase(thunks.getChatsMore.fulfilled, (state, { payload }) => {
        if (!payload.length) {
          state.chatsListMoreStatus = 'idle';
          return
        }
        
        const chats = payload?.map(chat => {
          const newChat = new Chat(chat);
          return newChat.getChat();
        });
        state.list.push(...chats);
        state.listPag = {
          ...state.listPag,
          offset: state.listPag.offset + state.listPag.current,
        };
        state.chatsListMoreStatus = 'success';
      })
      .addCase(thunks.getChatsMore.rejected, (state) => {
        state.chatsListMoreStatus = 'fail';
      })
      
      .addCase(chatsRoomThunks.sendMessage.fulfilled, (state, { payload }) => {
        const chatIdx = state.list.findIndex(chat => chat.chatLink === payload.chatId);
        if (chatIdx !== -1) {
          state.list[chatIdx].lastMessage.message = payload.msg;
          state.list[chatIdx].lastMessage.createdAt = formattedDateForChat(payload.createdAt);
        }
      })
      .addCase(chatsRoomThunks.muteChat.fulfilled, (state, { payload }) => {
        const chatIdx = state.list.findIndex(chat => chat.chatLink === payload.roomId);
        if (chatIdx !== -1) state.list[chatIdx].config.isMute = payload.isMute;
      })
      .addCase(chatsRoomThunks.archiveChat.fulfilled, (state, { payload }) => {
        const chatIdx = state.list.findIndex(chat => chat.chatLink === payload.roomId);
        if (chatIdx !== -1) state.list.splice(chatIdx, 1);
      })
      .addCase(chatsRoomThunks.removeChat.fulfilled, (state, { payload }) => {
        const chatIdx = state.list.findIndex(chat => chat.chatLink === payload.roomId);
        if (chatIdx !== -1) state.list.splice(chatIdx, 1);
      })
      .addCase(chatsRoomThunks.markAsRead.fulfilled, (state, { payload }) => {
        const chatIdx = state.list.findIndex(chat => chat.chatLink === payload.chatLink);
        if (chatIdx !== -1) {
          state.list[chatIdx].unreadMessagesCount = 0;
        }
      })
  
      .addCase(HANDLE_USER, (state, { payload }) => {
        const activeRoute = Router.router.pathname === '/chat/[[...slug]]';
        const chatIdx = state.list.findIndex(chat => chat.profile.user === payload.id);
  
        if (activeRoute && chatIdx !== -1) {
          changingUserDataWhoOnline(state.list[chatIdx], 'profile', payload);
        }
      });
  },
});

const chats = {
  actions: slice.actions,
  thunks,
  selectors,
};

export { chats };
export default slice.reducer;
