import { createSlice } from "@reduxjs/toolkit";
import { thunks } from "./thunks";
import { thunks as authThunks } from "store/auth/thunks";
import { thunks as registerThunks } from "store/register/thunks";
import { thunks as userEditProfileThunks } from "store/user/edit-profile/thunks";
import { selectors } from "./selectors";
import UserProfile from "resources/Profile/UserProfile";

const initialState = {
  profile: {},
  profileStatus: 'idle',
  avatarStatus: 'idle',
  albumStatus: 'idle',
  photoStatus: 'idle',
  isPremiumPopupActive: false,
};

export const slice = createSlice({
  name: 'userProfile',
  initialState: { ...initialState },
  reducers: {
    TOGGLE_POPUP(state, action) {
      state.isPremiumPopupActive = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(thunks.getUserProfile.pending, (state) => {
        state.profileStatus = 'pending';
      })
      .addCase(thunks.getUserProfile.fulfilled, (state, { payload }) => {
        const user = new UserProfile(payload);
        state.profile = user.getUserData();
        state.profileStatus = 'success';
      })
      .addCase(thunks.getUserProfile.rejected, (state) => {
        state.profileStatus = 'fail';
      })

      .addCase(thunks.changeAvatar.pending, (state) => {
        state.avatarStatus = 'pending';
      })
      .addCase(thunks.changeAvatar.fulfilled, (state, { payload }) => {
        const user = new UserProfile({ profile: payload.values, user: {} });
        state.profile = {
          ...state.profile,
          ...user.getUserEditedData(),
          subscription: { ...state.profile.subscription },
          isPremiumUser: state.profile.isPremiumUser
        };
        state.profile.avatarPath = payload.data.path;
        state.avatarStatus = 'success';
      })
      .addCase(thunks.changeAvatar.rejected, (state) => {
        state.avatarStatus = 'fail';
      })
      .addCase(thunks.addAlbum.pending, (state) => {
        state.albumStatus = 'pending';
      })
      .addCase(thunks.addAlbum.fulfilled, (state, { payload }) => {
        state.profile = { ...state.profile };
        state.profile.createdAlbum =  {...payload.data};
        state.albumStatus = 'success';
      })
      .addCase(thunks.addAlbum.rejected, (state) => {
        state.albumStatus = 'fail';
      })
      .addCase(thunks.addPhoto.pending, (state) => {
        state.photoStatus = 'pending';
      })
      .addCase(thunks.addPhoto.fulfilled, (state, { payload }) => {
        if(payload.albumId) {
          state.profile = {...state.profile};
          const el = state.profile.createdAlbum;
          el.photos.push(payload.data);
          state.profile.createdAlbum = { ...el };
        }
        state.photoStatus = 'success';
      })
      .addCase(thunks.addPhoto.rejected, (state) => {
        state.photoStatus = 'fail';
      })
      .addCase(thunks.getPhoto.fulfilled, (state, { payload} ) => {
        state.profile = {...state.profile};
        const photoIdx = state.profile.createdAlbum.photos.findIndex((item) => item.photoId === payload.photoId);
        const changeItem = state.profile.createdAlbum.photos[photoIdx];
        changeItem.img = payload.data.img;
        state.profile.createdAlbum.photos[photoIdx] = { ...changeItem };
      })
      .addCase(thunks.deletePhoto.fulfilled, (state, { payload} ) => {
        state.profile.createdAlbum.photos = state.profile.createdAlbum.photos.filter((item) => item.photoId !== payload.photoId)
      })
      .addCase(userEditProfileThunks.userEditProfile.fulfilled, (state, { payload }) => {
        const user = new UserProfile({ profile: payload, user: {} });
        state.profile = {
          ...state.profile,
          ...user.getUserEditedData(),
          subscription: { ...state.profile.subscription },
          isPremiumUser: state.profile.isPremiumUser
        };
      })
  
      .addCase(userEditProfileThunks.changeEmail.fulfilled, (state, { payload }) => {
        state.profile.email = payload.email;
      })

      .addCase(authThunks.login.fulfilled, (state, { payload }) => {
        const user = new UserProfile(payload);
        state.profile = user.getUserData();
        state.profileStatus = 'success';
      })
      .addCase(registerThunks.register.fulfilled, (state, { payload }) => {
        const user = new UserProfile(payload);
        state.profile = user.getUserData();
        state.profileStatus = 'success';
      })
      .addCase(authThunks.logout.fulfilled, (state) => {
        state.profile = {};
        state.profileStatus = 'idle';
      });
  },
});

const userProfile = {
  actions: slice.actions,
  thunks,
  selectors,
};

export { userProfile };
export default slice.reducer;
