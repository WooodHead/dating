import http from "api/http";
import { WEB_API_ROUTES } from "api/api-routes";

export const chats = {
  getChats(params) {
    return http.get(WEB_API_ROUTES.chats.getChats, {
      params: { ...params }
    });
  },
  getMessages(params) {
    return http.get(WEB_API_ROUTES.chats.getMessages, {
      params: { ...params }
    });
  },
  loadOldMessages(params) {
    return http.get(WEB_API_ROUTES.chats.loadOldMessages, {
      params: { ...params }
    });
  },
  sendMessage(data) {
    return http.post(WEB_API_ROUTES.chats.sendMessage, data);
  },
  muteOrArchiveChat(roomId, data) {
    return http.patch(WEB_API_ROUTES.chats.muteOrArchiveChat.replace('{roomId}', roomId), data);
  },
  removeChat(roomId) {
    return http.delete(WEB_API_ROUTES.chats.removeChat.replace('{roomId}', roomId));
  },
  markAsRead(data) {
    return http.post(WEB_API_ROUTES.chats.markAsRead, data);
  },
}
