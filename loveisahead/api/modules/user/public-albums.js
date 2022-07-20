import http from "api/http";
import { WEB_API_ROUTES } from "api/api-routes";

export const userPublicAlbums = {
  addAlbum(data) {
    return http.post(WEB_API_ROUTES.user.addAlbum, data);
  },
  getPublicAlbums({ userId, ...params }) {
    return http.get(WEB_API_ROUTES.user.getPublicAlbum.replace('{user_id}', userId), {
      params: { ...params }
    });
  },
  getPublicAlbumInfo(albumId) {
    return http.get(WEB_API_ROUTES.user.getAlbumInfo.replace('{album_id}', albumId));
  },
  deletePublicAlbum({ albumId }) {
    return http.delete(WEB_API_ROUTES.user.deleteAlbum.replace('{album_id}', albumId));
  },
  editAlbum({ albumId, data }) {
    return http.patch(WEB_API_ROUTES.user.editAlbum.replace('{album_id}', albumId), data);
  },
}
