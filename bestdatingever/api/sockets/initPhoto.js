import io from "socket.io-client";
import store from "store";
import { publicPhotos } from "store/profile/public-photos";
import { toast } from "react-toastify";

function initPhotoSocket(token, userId = 0) {
  const namespace = 'photo';
  
  if (!token) {
    console.error('=> token not found. Sockets are not connected');
    toast.error('Problems with permissions. Sockets are not connected');
    store.dispatch(publicPhotos.actions.SET_STATUS_REQUEST('fail'));
    return;
  }
  
  const socket = io(`${window.location.hostname}/${namespace}`, {
    reconnectionDelayMax: 10000,
    extraHeaders: {
      'Authorization': 'Bearer ' + token
    }
  });
  
  socket.on('connect', () => {
    // console.log('=> connected socket photo', socket.connected);
  });
  
  socket.emit('get-main-photos', {
    userId: userId,
    offset: 0,
    take: 8
  });
  
  socket.on('main-photos', data => {
    console.log('%c=> GET MAIN PHOTOS', 'color: limegreen', data);
    store.dispatch(publicPhotos.actions.SET_PHOTOS(data));
  });
  
  //
  socket.on('close', payload => {
    console.log('=> Socket photo was closed', payload);
  });
  
  socket.on('disconnect', data => {
    console.log('=> Socket photo disconnected!', data);
  });
  
  socket.on("connect_error", (err) => {
    console.log('=> Socket err:', err);
    // socket.auth.token = "abcd";
    // socket.connect();
  });
}

export default initPhotoSocket;