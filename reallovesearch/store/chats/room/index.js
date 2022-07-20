import { createSlice } from "@reduxjs/toolkit";
import { thunks } from "./thunks";
import { selectors } from "./selectors";
import ChatMessage from "resources/Chats/Message";
import { changingUserDataWhoOnline, userRelations } from "utils/userActions";
import { usersOnline } from "store/online";
import Router from "next/router";

const { HANDLE_USER } = usersOnline.actions;

const initialState = {
  listMsg: [],
  listMsgPag: {
    current: 20,
    take: 20,
  },
  listMsgStatus: 'idle',
  listOldMsg: [],
  listOldMsgPag: {
    current: 20,
    take: 20,
    offset: 0,
  },
  listOldMsgStatus: 'idle',
  listUnreadMsg: [],
  listNewMsg: [],
  //
  currentRoomId: null,
  currentRoomConfig: {
    isMute: false,
    isArchived: false,
  },
  targetUserId: null,
  profile: {
    _id: '',
    avatarPath: '',
    name: '',
    user: '',
    online: false
  },
  relation: {
    blockedFrom: false,
    blockedTo: false,
  },
  sendMessageStatus: 'idle',
  muteChatStatus: 'idle',
  archiveChatStatus: 'idle',
  removeChatStatus: 'idle',
  markAsReadStatus: 'idle',
};

const writeToListAsRead = (state, nameOfList, msgIds) => {
  state[nameOfList] = state[nameOfList].map(msg => {
    if (!msg.isRead && msgIds.includes(msg._id)) {
      return { ...msg, isRead: true };
    }
    
    return { ...msg };
  });
};

export const slice = createSlice({
  name: 'chatsRoom',
  initialState: { ...initialState },
  reducers: {
    SET_ROOM_ID: (state, { payload }) => {
      state.currentRoomId = payload;
    },
    SET_TARGET_USER_ID: (state, { payload }) => {
      state.targetUserId = payload;
    },
    SET_PROFILE: (state, { payload }) => {
      state.profile = { ...payload };
    },
    SET_NEW_MSG: (state, { payload }) => {
      if (state.currentRoomId === payload.chatLink) {
        const newMsg = new ChatMessage(
          payload,
          state.targetUserId,
          state.profile
        );
        
        state.listNewMsg.push(newMsg.getMessage());
      }
    },
    SET_MSG_IS_READ: (state, { payload }) => {
      if (state.currentRoomId === payload.chatLink) {
        if (state.listMsg.length > 0) writeToListAsRead(state, 'listMsg', payload.msgIds);
        if (state.listNewMsg.length > 0) writeToListAsRead(state, 'listNewMsg', payload.msgIds);
      }
    },
    RESET_ROOM_ID: (state) => {
      state.currentRoomId = null;
    },
    RESET_STATE: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(thunks.getMessages.pending, (state) => {
        state.listMsgStatus = 'pending';
      })
      .addCase(thunks.getMessages.fulfilled, (state, { payload }) => {
        state.relation = {
          blockedFrom: userRelations(payload?.relation?.from),
          blockedTo: userRelations(payload?.relation?.to)
        };
        state.profile = { ...payload?.profile };
        state.targetUserId = payload?.profile?.user;
        state.currentRoomConfig = payload?.roomConfig;
        
        state.listMsg = payload?.messages?.map(msg => {
          const newMsg = new ChatMessage(
            msg,
            state.targetUserId,
            state.profile
          );
          return newMsg.getMessage();
        });
        
        // unread messages
        state.listUnreadMsg = payload?.UnreadMessages?.map(msg => {
          const newMsg = new ChatMessage(
            msg,
            state.targetUserId,
            state.profile
          );
          return newMsg.getMessage();
        });
  
        state.listOldMsgPag = {
          ...state.listOldMsgPag,
          offset: state.listOldMsgPag.offset + state.listOldMsgPag.current,
        };
        
        state.listMsgStatus = 'success';
        state.listOldMsgStatus = 'success';
      })
      .addCase(thunks.getMessages.rejected, (state, { payload }) => {
        if (payload) {
          const { statusCode } = payload;
          if (statusCode === 406) {
            state.listMsgStatus = 'idle';
            return
          }
        }
        
        state.listMsgStatus = 'fail';
      })
  
      .addCase(thunks.loadOldMessages.pending, (state) => {
        state.listOldMsgStatus = 'pending';
      })
      .addCase(thunks.loadOldMessages.fulfilled, (state, { payload }) => {
        if (!payload.length) {
          state.listOldMsgStatus = 'idle';
          return
        }
  
        const messages = payload?.map(msg => {
          const newMsg = new ChatMessage(
            msg,
            state.targetUserId,
            state.profile
          );
          return newMsg.getMessage();
        });

        state.listOldMsg.unshift(...messages);
        state.listOldMsgPag = {
          ...state.listOldMsgPag,
          offset: state.listOldMsgPag.offset + state.listOldMsgPag.current,
        };
        
        state.listOldMsgStatus = 'success';
      })
      .addCase(thunks.loadOldMessages.rejected, (state) => {
        state.listOldMsgStatus = 'fail';
      })
      
      .addCase(thunks.sendMessage.pending, (state) => {
        state.sendMessageStatus = 'pending';
      })
      .addCase(thunks.sendMessage.fulfilled, (state, { payload }) => {
        if (!state.currentRoomId) {
          state.currentRoomId = payload.chatId;
        } else {
          const newMsg = new ChatMessage({
            _id: payload.msgId,
            createdAt: payload.createdAt,
            message: payload.msg,
            isRead: payload.isRead,
          });
          state.listNewMsg.push(newMsg.setNewMessage());
        }
        
        state.sendMessageStatus = 'success';
      })
      .addCase(thunks.sendMessage.rejected, (state) => {
        state.sendMessageStatus = 'fail';
      })
      
      .addCase(thunks.muteChat.pending, (state) => {
        state.muteChatStatus = 'pending';
      })
      .addCase(thunks.muteChat.fulfilled, (state, { payload }) => {
        state.currentRoomConfig.isMute = payload.isMute;
        state.muteChatStatus = 'success';
      })
      .addCase(thunks.muteChat.rejected, (state) => {
        state.muteChatStatus = 'fail';
      })
      
      .addCase(thunks.archiveChat.pending, (state) => {
        state.archiveChatStatus = 'pending';
      })
      .addCase(thunks.archiveChat.fulfilled, (state, { payload }) => {
        state.currentRoomConfig.isArchived = payload.isArchived;
        state.archiveChatStatus = 'success';
      })
      .addCase(thunks.archiveChat.rejected, (state) => {
        state.archiveChatStatus = 'fail';
      })
      
      .addCase(thunks.removeChat.pending, (state) => {
        state.removeChatStatus = 'pending';
      })
      .addCase(thunks.removeChat.fulfilled, () => initialState)
      .addCase(thunks.removeChat.rejected, (state) => {
        state.markAsReadStatus = 'fail';
      })
      
      .addCase(thunks.markAsRead.pending, (state) => {
        state.markAsReadStatus = 'pending';
      })
      .addCase(thunks.markAsRead.fulfilled, (state, { payload }) => {
        if (state.listUnreadMsg.length > 0) writeToListAsRead(state, 'listUnreadMsg', payload.messagesIds);
        if (state.listNewMsg.length > 0) writeToListAsRead(state, 'listNewMsg', payload.messagesIds);
        
        state.markAsReadStatus = 'success';
      })
      .addCase(thunks.markAsRead.rejected, (state) => {
        state.markAsReadStatus = 'fail';
      })
  
      .addCase(HANDLE_USER, (state, { payload }) => {
        const activeRoute = Router.router.pathname === '/chat/[[...slug]]';
        const activeChat = state.targetUserId === payload.id;
    
        if (activeRoute && activeChat) {
          changingUserDataWhoOnline(state, 'profile', payload);
        }
      });
  },
});

const chatsRoom = {
  actions: slice.actions,
  thunks,
  selectors,
};

export { chatsRoom };
export default slice.reducer;
