import io from "socket.io-client";
import store from "store";
import { toast } from "react-toastify";
import { chats } from "store/chats";
import { chatsRoom } from "store/chats/room";
import { userProfile } from "store/user/profile";
import Router from "next/router";

class initChatSocket {
  constructor({ jwtToken }) {
    this.token = jwtToken;
    this.namespace = 'chat';
    this.socket = null;
  }
  
  init() {
    if (!this.token) {
      console.error('=> Token not found. Sockets are not connected');
      toast.error('Problems with permissions. Sockets are not connected');
      store.dispatch(chats.actions.SET_SOCKET_STATUS('fail'));
      return;
    }
    
    this.socket = io(`${window.location.hostname}/${this.namespace}`, {
      reconnectionDelayMax: 10000,
      extraHeaders: {
        'Authorization': 'Bearer ' + this.token
      }
    });
    
    this.socket.on('connect', () => {
      console.log('%c=> Connected chat socket', 'color: limegreen', this.socket.connected);
      store.dispatch(chats.actions.SET_SOCKET_STATUS('success'));
    });
    
    this.socket.on('close', payload => {
      console.log('=> Socket chat was closed', payload);
    });
    
    this.socket.on('disconnect', data => {
      console.log('%c=> Socket chat disconnected!', 'color: red', data, this.socket);
      store.dispatch(chats.actions.SET_SOCKET_STATUS('fail'));
    });
    
    this.socket.on("connect_error", (err) => {
      console.error('=> Socket chat connect_error:', err);
      // if (err.message === "invalid credentials") {
      //   this.socket.auth.token = "efgh";
      //   this.socket.connect();
      // }
      store.dispatch(chats.actions.SET_SOCKET_STATUS('error'));
    });
  }
  
  connectToRoom() {
    if (!this.socket) return
    
    this.socket.on('message.send', (msg) => {
      const profile = userProfile.selectors.profile(store.getState());
      
      if (msg.toUser === profile.user) {
        store.dispatch(chats.actions.SET_NEW_MSG(msg));
        store.dispatch(chatsRoom.actions.SET_NEW_MSG(msg));
      }
    });
    
    this.socket.on('message.read', (messages) => {
      store.dispatch(chatsRoom.actions.SET_MSG_IS_READ(messages));
    });
    
    this.socket.on('room.create', (e) => {
      store.dispatch(chats.actions.CREATE_ROOM(e));
    });
    
    this.socket.on('chat.delete', (e) => {
      Router.push('/chat');
      store.dispatch(chats.actions.DELETE_ROOM(e));
      store.dispatch(chatsRoom.actions.RESET_STATE());
      toast.success(`User ${e?.profile?.name} deleted chat with you`);
    });
  }
  
  socketDisconnect() {
    this.socket.disconnect();
    this.token = null;
    this.socket = null;
  }
}

export default initChatSocket;