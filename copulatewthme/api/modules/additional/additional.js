import http from "api/http";
import { WEB_API_ROUTES } from "api/api-routes";

export const additionalData = {
  getAdditionalEnums() {
    return http.get(WEB_API_ROUTES.additional.enums);
  },
  getAdditionalNational() {
    return http.get(WEB_API_ROUTES.additional.nationals);
  },
  getAdditionalLang() {
    return http.get(WEB_API_ROUTES.additional.lang);
  },
  getAdditionalLocation(params) {
    return http.get(WEB_API_ROUTES.additional.location, {
      params: { ...params }
    });
  },
}
