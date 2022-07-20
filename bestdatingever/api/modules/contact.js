import http from 'api/http';
import { WEB_API_ROUTES } from 'api/api-routes';

export const contact = {
  postMessage(data) {
    return http.post(WEB_API_ROUTES.contactUs.contact, data);
  }
}
