import http from "api/http";
import { WEB_API_ROUTES } from "api/api-routes";

export const userSettings = {
  getUserSettings() {
    return http.get(WEB_API_ROUTES.user.settings);
  },
  saveUserSettings(settingsData) {
    return http.patch(WEB_API_ROUTES.user.settings, settingsData);
  },
}
