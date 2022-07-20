export default class PhotoCard {
  constructor({ photo, key }) {
    this.photo = { ...photo };
    this.photoDefault = {
      _id: Date.now(),
      original: '',
      thumbnail: '',
      inProcess: true,
      error: false,
      loaded: false,
      likes: {
        heart: 0,
        like: 0,
        isUserPutHeart: false,
        isUserPutLike: false,
      },
    };
    this.key = key;
  }

  setPhotoError() {
    this.photoDefault.inProcess = false;
    this.photoDefault.error = true;
  }
  
  getPhotoDefault() {
    return this.photoDefault;
  }

  getPhotoType(type) {
    return typeof type === 'string' && type?.toLowerCase() === 'blur';
  }

  getPhoto() {
    const {
      _id,
      id,
      img,
      likes,
      type,
    } = this.photo;

    return {
      _id: _id || id || Date.now() + this.key,
      original: img,
      thumbnail: img,
      inProcess: false,
      error: false,
      loaded: true,
      likes,
      isBlurred: this.getPhotoType(type),
    };
  }
}