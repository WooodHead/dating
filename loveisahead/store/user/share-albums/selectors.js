import { prepareUsersShape } from "utils/preps";

const selectors = {
  usersSharedAlbums: state => prepareUsersShape(state.userShareAlbums.usersSharedAlbums),
  refuseSharingFromUserStatus: state => state.userShareAlbums.refuseSharingFromUserStatus,
  shareAlbums: state => state.shareAlbums.shareAlbums,
  shareAlbumsStatus: state => state.shareAlbums.shareAlbumsStatus,
  getShareAlbumsStatus: state => state.shareAlbums.getShareAlbumsStatus,
  pagination: state => state.shareAlbums.pagination,
};

export { selectors };