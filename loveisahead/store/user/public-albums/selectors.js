const selectors = {
  albums: state => state.userPublicAlbums.albums,
  albumsCount: state => state.userPublicAlbums.albumsCount,
  pagination: state => state.userPublicAlbums.pagination,
  getAlbumsStatus: state => state.userPublicAlbums.getAlbumsStatus,
  deleteAlbumStatus: state => state.userPublicAlbums.deleteAlbumStatus,
  currentAlbum: state => state.userPublicAlbums.currentAlbum,
  currentAlbumStatus: state => state.userPublicAlbums.currentAlbumStatus,
};

export { selectors };
