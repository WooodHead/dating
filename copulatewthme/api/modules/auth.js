import http from "api/http";
import { WEB_API_ROUTES } from "api/api-routes";

export const auth = {
  login(data) {
    return http.post(WEB_API_ROUTES.auth.login, data);
  },
  logout() {
    return http.post(WEB_API_ROUTES.auth.logout);
  },
  register(data) {
    return http.post(WEB_API_ROUTES.auth.register, data);
  }
}
