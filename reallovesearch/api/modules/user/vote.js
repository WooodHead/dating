import http from "api/http";
import { WEB_API_ROUTES } from "api/api-routes";

export const userVote = {
  setUserLike(targetUserId) {
    return http.post(WEB_API_ROUTES.user.setUserLike.replace('{targetUserId}', targetUserId), {
      likeType: 'Like'
    });
  },
  setUserHeart(targetUserId) {
    return http.post(WEB_API_ROUTES.user.setUserLike.replace('{targetUserId}', targetUserId), {
      likeType: 'Heart'
    });
  },
  setPhotoLike(photoId) {
    return http.post(WEB_API_ROUTES.user.setPhotoLike.replace('{photoId}', photoId), {
      likeType: 'Like'
    });
  },
  setPhotoHeart(photoId) {
    return http.post(WEB_API_ROUTES.user.setPhotoLike.replace('{photoId}', photoId), {
      likeType: 'Heart'
    });
  },
}
