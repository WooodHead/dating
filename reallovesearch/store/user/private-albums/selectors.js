const selectors = {
  albums: state => state.userPrivateAlbums.albums,
  albumsCount: state => state.userPrivateAlbums.albumsCount,
  pagination: state => state.userPrivateAlbums.pagination,
  getAlbumsStatus: state => state.userPrivateAlbums.getAlbumsStatus,
  deleteAlbumStatus: state => state.userPrivateAlbums.deleteAlbumStatus,
};

export { selectors };
