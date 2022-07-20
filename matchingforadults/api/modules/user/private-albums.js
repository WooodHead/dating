import http from "api/http";
import { WEB_API_ROUTES } from "api/api-routes";

export const userPrivateAlbums = {
  getPrivateAlbums({ userId, ...params }) {
    return http.get(WEB_API_ROUTES.user.getPrivateAlbums.replace('{user_id}', userId), {
      params: { ...params }
    });
  },
}
