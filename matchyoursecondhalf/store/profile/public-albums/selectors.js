const selectors = {
  albums: state => state.publicAlbums.albums,
  albumsCount: state => state.publicAlbums.albumsCount,
  pagination: state => state.publicAlbums.pagination,
  getAlbumsStatus: state => state.publicAlbums.getAlbumsStatus,
  currentAlbum: state => state.publicAlbums.currentAlbum,
  currentAlbumStatus: state => state.publicAlbums.currentAlbumStatus,
};

export { selectors };
