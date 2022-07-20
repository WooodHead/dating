const selectors = {
  albums: state => state.privateAlbums.albums,
  albumsCount: state => state.privateAlbums.albumsCount,
  pagination: state => state.privateAlbums.pagination,
  getAlbumsStatus: state => state.privateAlbums.getAlbumsStatus,
};

export { selectors };
