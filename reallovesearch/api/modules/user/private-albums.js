import http from "api/http";
import { WEB_API_ROUTES } from "api/api-routes";

export const userPrivateAlbums = {
  getPrivateAlbums({ userId, ...params }) {
    return http.get(WEB_API_ROUTES.user.getPrivateAlbums.replace('{user_id}', userId), {
      params: { ...params }
    });
  },
  shareAlbums({ albumsIds, userId }) {
    return http.post(WEB_API_ROUTES.user.shareAlbums, {
      targetUserId: userId, album_ids: albumsIds
    });
  },

  getUsersAlbumSharedTo({ albumId }) {
    return http.get(WEB_API_ROUTES.user.getUsersAlbumSharedTo.replace('{album_id}', albumId));
  },

  deleteSharedUser({ userId, albumId }) {
    return http.delete(WEB_API_ROUTES.user.deleteUserForSharedAlbum, {
      params: { targetUserId: userId, album_id: albumId }
    });
  },
}
