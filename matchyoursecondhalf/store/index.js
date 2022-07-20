import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';

import auth from "./auth/auth";
import register from "./register/register";
import userProfile from "./user/profile";
import userEditProfile from "./user/edit-profile";
import userPublicAlbums from "./user/public-albums";
import userPublicPhotosByAlbum from "./user/public-photos-by-album";
import userPublicMainPhotos from "./user/public-main-photos";
import userPrivateAlbums from "./user/private-albums";
import userSettings from "./settings/notifications";
import usersProfiles from "./users/profiles";
import additionalData from "./additional/additionalData";
import publicProfile from "./profile/public-profile";
import publicPhotos from "./profile/public-photos";
import publicAlbums from "./profile/public-albums";
import publicPhotosByAlbum from "./profile/public-photos-by-album";
import privateAlbums from "./profile/private-albums";
import photos from './photos'
import chats from "./chats";
import chatsRoom from "./chats/room";
import userNotifications from "./notifications";
import usersOnline from "./online";
import windowActions from "./windowActions";
import userVote from "./vote";
import searchParams from "./users/searchParams";
// import buyingSubscription from "./user/subscription/buying";
import emailVerification from "./emailVerification";
import contact from './contact/contact'
import buyingSubscription from "./user/subscription/buying";

const reducers = combineReducers({
  auth,
  register,
  userProfile,
  userEditProfile,
  userPublicAlbums,
  userPublicPhotosByAlbum,
  userPublicMainPhotos,
  userPrivateAlbums,
  usersProfiles,
  additionalData,
  publicProfile,
  publicPhotos,
  publicAlbums,
  publicPhotosByAlbum,
  privateAlbums,
  photos,
  chats,
  chatsRoom,
  userSettings,
  userNotifications,
  usersOnline,
  windowActions,
  userVote,
  searchParams,
  // buyingSubscription,
  emailVerification,
  contact,
  buyingSubscription
});

const persistConfig = {
  key: 'matchyoursecondhalf',
  storage,
  blacklist: [],
  whitelist: ['auth', 'userProfile', 'additionalData', 'searchParams', 'buyingSubscription'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
});

export default store;
