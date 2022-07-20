import http from "api/http";
import { WEB_API_ROUTES } from "api/api-routes";

export const publicProfile = {
  getPublicProfile(userId) {
    return http.get(WEB_API_ROUTES.public.getPublicProfile.replace(
      '{user_id}',
      userId
    ));
  },
  relationsUser(relations) {
    return http.post(WEB_API_ROUTES.public.relationsUser, relations);
  },
  getListOfReasons() {
    return http.get(WEB_API_ROUTES.public.getListOfReasons);
  },
  reportUser(data) {
    return http.post(WEB_API_ROUTES.public.reportUser, data);
  },
}
