const selectors = {
  photos: state => state.userPublicMainPhotos.photos,
  addPhotoStatus: state => state.userPublicMainPhotos.addPhotoStatus,
  status: state => state.userPublicMainPhotos.status,
  deletePhotoStatus: state => state.userPublicMainPhotos.deletePhotoStatus,
};

export { selectors };
