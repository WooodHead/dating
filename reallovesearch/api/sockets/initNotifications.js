import io from "socket.io-client";
import store from "store";
import { toast } from "react-toastify";
import { userNotifications } from "store/notifications";

class initNotificationSocket {
  constructor({ jwtToken }) {
    this.token = jwtToken;
    this.namespace = 'notification';
    this.socket = null;
    this.timeoutNotification = null;
    this.timeoutSeconds = 15000;
  }
  
  init() {
    if (!this.token) {
      console.error('=> Token not found. Sockets are not connected');
      toast.error('Problems with permissions. Sockets are not connected');
      store.dispatch(userNotifications.actions.SET_SOCKET_STATUS('fail'));
      return;
    }
    
    this.socket = io(`${window.location.hostname}/${this.namespace}`, {
      reconnectionDelayMax: 10000,
      extraHeaders: {
        'Authorization': 'Bearer ' + this.token
      }
    });
    
    this.socket.on('connect', () => {
      console.log('%c=> Connected notification socket', 'color: limegreen', this.socket.connected);
      store.dispatch(userNotifications.actions.SET_SOCKET_STATUS('success'));
    });
    
    this.socket.on('close', payload => {
      console.log('=> Socket notification was closed', payload);
    });
    
    this.socket.on('disconnect', data => {
      console.log('%c=> Socket notification disconnected!', 'color: red', data, this.socket);
      store.dispatch(userNotifications.actions.SET_SOCKET_STATUS('fail'));
    });
    
    this.socket.on("connect_error", (err) => {
      console.error('=> Socket notification connect_error:', err);
      // if (err.message === "invalid credentials") {
      //   this.socket.auth.token = "efgh";
      //   this.socket.connect();
      // }
      store.dispatch(userNotifications.actions.SET_SOCKET_STATUS('error'));
    });
  }
  
  connectToNotification() {
    if (!this.socket) return
    
    this.socket.on('message.send', (msg) => {
      store.dispatch(userNotifications.actions.SET_NEW_NOTIFICATION(msg));
      store.dispatch(userNotifications.actions.SET_LIST_VISIBLE(true));
      
      clearInterval(this.timeoutNotification);
      this.timeoutNotification = setTimeout(() => {
        store.dispatch(userNotifications.actions.SET_LIST_VISIBLE(false));
      }, this.timeoutSeconds);
    });
    
    this.socket.on('album.share', (msg) => {
      console.log('%c=> album.share', 'color: limegreen', msg);
    });
    
    this.socket.on('message.read', (messagesIds) => {
      if (messagesIds.length > 0) {
        store.dispatch(userNotifications.actions.DELETE_NOTIFICATION(messagesIds));
      }
    });
  }
  
  socketDisconnect() {
    this.socket.disconnect();
    this.token = null;
    this.socket = null;
  }
}

export default initNotificationSocket;