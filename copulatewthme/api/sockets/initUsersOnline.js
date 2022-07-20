import io from "socket.io-client";
import store from "store";
import { toast } from "react-toastify";
import { usersOnline } from "store/online";

class initUsersOnlineSocket {
  constructor({ jwtToken }) {
    this.token = jwtToken;
    this.namespace = 'online';
    this.socket = null;
  }
  
  init() {
    if (!this.token) {
      console.error('=> Token not found. Sockets are not connected');
      toast.error('Problems with permissions. Sockets are not connected');
      store.dispatch(usersOnline.actions.SET_SOCKET_STATUS('fail'));
      return;
    }
    
    this.socket = io(`${window.location.hostname}/${this.namespace}`, {
      reconnectionDelayMax: 10000,
      extraHeaders: {
        'Authorization': 'Bearer ' + this.token
      }
    });
    
    this.socket.on('connect', () => {
      console.log('%c=> Connected user is online socket', 'color: limegreen', this.socket.connected);
      store.dispatch(usersOnline.actions.SET_SOCKET_STATUS('success'));
    });
    
    this.socket.on('close', payload => {
      console.log('=> Socket user is online was closed', payload);
    });
    
    this.socket.on('disconnect', data => {
      console.log('%c=> Socket user is online disconnected!', 'color: red', data, this.socket);
      store.dispatch(usersOnline.actions.SET_SOCKET_STATUS('fail'));
    });
    
    this.socket.on("connect_error", (err) => {
      console.error('=> Socket user is online connect_error:', err);
      // if (err.message === "invalid credentials") {
      //   this.socket.auth.token = "efgh";
      //   this.socket.connect();
      // }
      store.dispatch(usersOnline.actions.SET_SOCKET_STATUS('error'));
    });
  }
  
  connectUsersToSystem() {
    if (!this.socket) return
    
    this.socket.on('login', (userId) => {
      // console.log('%c=> USER ONLINE', 'color: limegreen', userId);
      store.dispatch(usersOnline.actions.HANDLE_USER({
        id: userId,
        action: 'add'
      }));
    });
    
    this.socket.on('logout', (userId) => {
      // console.log('%c=> USER OFFLINE', 'color: limegreen', userId);
      store.dispatch(usersOnline.actions.HANDLE_USER({
        id: userId,
        action: 'remove'
      }));
    });
  }
  
  socketDisconnect() {
    this.socket.disconnect();
    this.token = null;
    this.socket = null;
  }
}

export default initUsersOnlineSocket;