import http from "api/http";
import { WEB_API_ROUTES } from "api/api-routes";

export const usersProfiles = {
  getUsersProfiles(params) {
    return http.get(WEB_API_ROUTES.users.getUsersProfiles, {
      params: { ...params }
    });
  },
  getShareUsers(params) {
    return http.get(WEB_API_ROUTES.users.getShareUsers, {
      params: { ...params }
    });
  }
}
