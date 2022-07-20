const selectors = {
  list: state => state.chats.list,
  listPag: state => state.chats.listPag,
  listStatus: state => state.chats.listStatus,
  chatsListMoreStatus: state => state.chats.chatsListMoreStatus,
  socketStatus: state => state.chats.socketStatus,
};

export { selectors };
