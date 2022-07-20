const selectors = {
  photos: state => state.userPublicPhotosByAlbum.photos,
  addPhotoStatus: state => state.userPublicPhotosByAlbum.addPhotoStatus,
  status: state => state.userPublicPhotosByAlbum.status,
  deletePhotoStatus: state => state.userPublicPhotosByAlbum.deletePhotoStatus,
};

export { selectors };
