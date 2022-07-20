const prepareUsersShape = (list) => {
  if (list.length > 0) return list.map(({ profile: { user, smAvatarPath, name } }) => ({
    _id: user,
    path: smAvatarPath,
    value: name,
    label: name,
  }));

  else return [];
};

const selectors = {
  shareUsers: state => prepareUsersShape(state.shareAlbums.shareUsers),
  usersAlbumSharedTo: state => prepareUsersShape(state.shareAlbums.usersAlbumSharedTo),
  shareAlbums: state => state.shareAlbums.shareAlbums,
  shareUsersStatus: state => state.shareAlbums.loadingShareUsersStatus,
  shareAlbumsStatus: state => state.shareAlbums.shareAlbumsStatus,
  deleteUserStatus: state => state.shareAlbums.deleteUserStatus,
  pagination: state => state.shareAlbums.pagination,
};

export { selectors };