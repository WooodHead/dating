import io from "socket.io-client";
import store from "store";
import { userPublicPhotosByAlbum } from "store/user/public-photos-by-album";
import { toast } from "react-toastify";

class initPhotoSocket {
  constructor() {
    this.token = store.getState().auth.token;
    this.namespace = 'photo';
    this.socket = null;
  }
  
  connect() {
    if (!this.token) {
      // console.error('=> Token not found. Sockets are not connected');
      toast.error('Problems with permissions. Sockets are not connected');
      store.dispatch(userPublicPhotosByAlbum.actions.SET_STATUS_REQUEST('fail'));
      return;
    }
    
    this.socket = io(`${window.location.hostname}/${this.namespace}`, {
      reconnectionDelayMax: 10000,
      extraHeaders: {
        'Authorization': 'Bearer ' + this.token
      }
    });
  
    this.socket.on('connect', () => {
      console.log('%c=> Connected socket photo', 'color: limegreen', this.socket.connected);
    });
  
    this.socket.on('close', payload => {
      console.log('=> Socket photo was closed', payload);
    });
  
    this.socket.on('disconnect', data => {
      console.log('=> Socket photo disconnected!', data);
    });
  
    this.socket.on("connect_error", (err) => {
      console.log('=> Socket err:', err);
      // socket.auth.token = "abcd";
      // socket.connect();
    });
  }
  
  getByAlbum(albumId) {
    if (!this.socket) return
    
    this.socket.emit('get-photos', {
      albumId: albumId,
      offset: 0,
      take: 10
    });

    this.socket.on('photo-by-album', data => {
      console.log('%c=> GET PHOTOS BY ALBUM', 'color: limegreen', data);
      store.dispatch(userPublicPhotosByAlbum.actions.SET_PHOTOS(data));
    });
  }
}

export default initPhotoSocket;