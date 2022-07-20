import { auth } from "./modules/auth";
import { userProfile } from "./modules/user/profile";
import { userPublicAlbums } from "./modules/user/public-albums";
import { userPrivateAlbums } from "./modules/user/private-albums";
import { usersProfiles } from "./modules/users/profiles";
import { additionalData } from "./modules/additional/additional";
import { contact } from "./modules/contact";
import { publicProfile } from "./modules/profile/publicProfile";
import { chats } from "./modules/chats/chats";
import { userSettings } from "./modules/user/settings";
import { userNotifications } from "./modules/user/notifications";
import { userVote } from "./modules/user/vote";

export const api = {
  auth,
  userProfile,
  userPublicAlbums,
  userPrivateAlbums,
  usersProfiles,
  additionalData,
  contact,
  publicProfile,
  chats,
  userSettings,
  userNotifications,
  userVote,
}
