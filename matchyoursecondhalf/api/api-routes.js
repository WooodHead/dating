export const WEB_API_ROUTES = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/registration',
  },
  user: {
    getUserProfile: '/user-profile',
    changeAvatar: '/photo/avatar',
    addAlbum: '/album',
    getPublicAlbum: '/album/public/{user_id}',
    getPrivateAlbums: '/album/private/{user_id}',
    getAlbumInfo: '/album/info/{album_id}',
    deleteAlbum: '/album/{album_id}',
    editAlbum: '/album/{album_id}',
    addPhoto: '/photo',
    addPhotoToAlbum: '/photo/{album_id}',
    getPhoto: '/photo/{photoId}',
    getPhotos: '/photo/main/{target_user_id}',
    getPhotosByAlbum: '/photo/album/{album_id}',
    userEditProfile: '/user-profile',
    changeEmail: '/user/change-email',
    changePhone: '/user',
    changePassword: '/user/reset-password',
    createNewPassword: '/user/reset-password/token',
    resetPassword: '/user/reset-password/token/send',
    settings: '/notification/config',
    notifications: '/notification',
    notificationDelete: '/notification/{notification_id}',
    setUserLike: '/user-profile/like/{targetUserId}',
    setPhotoLike: '/photo/like/{photoId}',
    emailVerification: 'user/email-verification',
    emailVerificationResend: '/auth/resend/email-verification'
  },
  users: {
    getUsersProfiles: '/search',
  },
  additional: {
    enums: '/data/enums',
    nationals: '/data/nationals',
    lang: '/data/lang',
    location: '/search/location',
  },
  contactUs: {
    contact: '/contact'
  },
  public: {
    getPublicProfile: 'user-profile/user/{user_id}',
    relationsUser: 'users-relations/change-relation',
    getListOfReasons: 'report/list-of-reasons',
    reportUser: 'report',
  },
  chats: {
    getChats: 'chat-rooms',
    getMessages: 'chat/messages-middle',
    loadOldMessages: 'chat/messages',
    sendMessage: 'chat/send',
    muteOrArchiveChat: 'chat-rooms/{roomId}',
    removeChat: 'chat/{roomId}',
    markAsRead: 'chat/mark-as-read',
  }
}