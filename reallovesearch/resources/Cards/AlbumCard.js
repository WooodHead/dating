export default class AlbumCard {
  constructor(album, isOwner) {
    this.album = { ...album };
    this.owner = isOwner;
    this.albumDefault = {
      _id: '',
      name: '',
      titlePhoto: '',
      type: 'public',
      photos: [],
      amount: 0,
      permission: false
    };
  }

  getAlbum() {
    const {
      _id,
      name,
      titlePhoto,
      type,
      photos,
    } = this.album;

    return {
      _id,
      name,
      titlePhoto, // thumb
      type,
      photos,
      amount: photos.length,
      permission: this.owner || type.toLowerCase() === 'public'
    };
  }
}