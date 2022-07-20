const selectors = {
  listMsg: state => state.chatsRoom.listMsg,
  listMsgPag: state => state.chatsRoom.listMsgPag,
  listMsgStatus: state => state.chatsRoom.listMsgStatus,
  listOldMsg: state => state.chatsRoom.listOldMsg,
  listOldMsgPag: state => state.chatsRoom.listOldMsgPag,
  listOldMsgStatus: state => state.chatsRoom.listOldMsgStatus,
  listUnreadMsg: state => state.chatsRoom.listUnreadMsg,
  listNewMsg: state => state.chatsRoom.listNewMsg,
  currentRoomId: state => state.chatsRoom.currentRoomId,
  targetUserId: state => state.chatsRoom.targetUserId,
  profile: state => state.chatsRoom.profile,
  relation: state => state.chatsRoom.relation,
  currentRoomConfig: state => state.chatsRoom.currentRoomConfig,
  removeChatStatus: state => state.chatsRoom.removeChatStatus,
};

export { selectors };
