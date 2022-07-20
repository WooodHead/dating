import http from "api/http";
import { WEB_API_ROUTES } from "api/api-routes";

export const userProfile = {
  getUserProfile() {
    return http.get(WEB_API_ROUTES.user.getUserProfile);
  },
  changeAvatar(file) {
    return http.put(WEB_API_ROUTES.user.changeAvatar, file);
  },
  addPhoto(payload) {
    return http.post(WEB_API_ROUTES.user.addPhoto, payload);
  },
  addPhotoByAlbum({albumId, img}) {
    return http.post(WEB_API_ROUTES.user.addPhotoToAlbum.replace('{album_id}', albumId), img, {params: albumId});
  },
  getPhoto(photoId) {
    return http.get(WEB_API_ROUTES.user.getPhoto.replace('{photoId}', photoId), {params: photoId});
  },
  getPhotos(userId) {
    return http.get(WEB_API_ROUTES.user.getPhotos.replace('{target_user_id}', userId));
  },
  getPhotosByAlbum(albumId) {
    return http.get(WEB_API_ROUTES.user.getPhotosByAlbum.replace('{album_id}', albumId));
  },
  deletePhoto(photoId) {
    return http.delete(WEB_API_ROUTES.user.getPhoto.replace('{photoId}', photoId));
  },
  userEditProfile(data) {
    return http.patch(WEB_API_ROUTES.user.userEditProfile, data);
  },
  changeEmail(data) {
    return http.post(WEB_API_ROUTES.user.changeEmail, data);
  },
  changePhone(data) {
    return http.patch(WEB_API_ROUTES.user.changePhone, data);
  },
  changePassword(data) {
    return http.post(WEB_API_ROUTES.user.changePassword, data);
  },
  resetPassword(data) {
    return http.post(WEB_API_ROUTES.user.resetPassword, data);
  },
  emailVerification(token) {
    return http.post(WEB_API_ROUTES.user.emailVerification,  {}, {headers : {'Authorization': `Bearer ${token}`}})
  },
  emailVerificationResend(data) {
    return http.post(WEB_API_ROUTES.user.emailVerificationResend,  data)
  },
  createNewPassword(data, token) {
    return http.post(WEB_API_ROUTES.user.createNewPassword,  data, {headers : {'Authorization': `Bearer ${token}`}});
  },
}
