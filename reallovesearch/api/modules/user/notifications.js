import http from "api/http";
import { WEB_API_ROUTES } from "api/api-routes";

export const userNotifications = {
  getNotifications() {
    return http.get(WEB_API_ROUTES.user.notifications);
  },
  deleteNotification(notificationId) {
    return http.delete(WEB_API_ROUTES.user.notificationDelete.replace('{notification_id}', notificationId));
  },
  deleteAllNotifications() {
    return http.delete(WEB_API_ROUTES.user.notifications);
  },
}
