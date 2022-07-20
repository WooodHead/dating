const selectors = {
  photos: state => state.publicPhotosByAlbum.photos,
  status: state => state.publicPhotosByAlbum.status,
};

export { selectors };
