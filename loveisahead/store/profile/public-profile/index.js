import { createSlice } from "@reduxjs/toolkit";
import { thunks } from "./thunks";
import { selectors } from "./selectors";
import PublicProfile from "resources/Profile/PublicProfile";
import { changingUserDataWhoOnline, userRelations } from "utils/userActions";
import { changingUserOrPhotoHeart, changingUserOrPhotoLike } from "utils/userVote";
import { usersOnline } from "store/online";
import Router from "next/router";
import { thunks as userVoteThunks } from "store/vote/thunks";

const { HANDLE_USER } = usersOnline.actions;

const initialState = {
  profile: {},
  status: 'idle',
  statusCode: 0,
  blockUserStatus: 'idle',
  reportUserStatus: 'idle',
  listOfReasons: [],
  listOfReasonsStatus: 'idle',
  activeMainTab: 'profile',
  activeSubTab: 'mainPhotos',
};

const slice = createSlice({
  name: 'publicProfile',
  initialState: { ...initialState },
  reducers: {
    RESET_STATE: () => initialState,
    SET_MAIN_TAB: (state, { payload }) => {
      state.activeMainTab = payload;
    },
    SET_SUB_TAB: (state, { payload }) => {
      state.activeSubTab = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(thunks.getPublicProfile.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(thunks.getPublicProfile.fulfilled, (state, { payload }) => {
        const user = new PublicProfile({
          ...payload.profile,
          relations: payload.relations,
          chatLink: payload.chatLink,
          likes: payload.likes,
          distance: payload.distance,
        });
        state.profile = user.getPublicProfile();
        state.status = 'success';
      })
      .addCase(thunks.getPublicProfile.rejected, (state, { payload }) => {
        state.status = 'fail';
        state.statusCode = payload?.statusCode;
      })
      
      .addCase(thunks.relationsUser.pending, (state) => {
        state.blockUserStatus = 'pending';
      })
      .addCase(thunks.relationsUser.fulfilled, (state, { payload }) => {
        state.profile.blockedTo = userRelations(payload.relation);
        state.blockUserStatus = 'success';
      })
      .addCase(thunks.relationsUser.rejected, (state) => {
        state.blockUserStatus = 'fail';
      })
      
      .addCase(thunks.getListOfReasons.pending, (state) => {
        state.listOfReasonsStatus = 'pending';
      })
      .addCase(thunks.getListOfReasons.fulfilled, (state, { payload }) => {
        if (payload) {
          state.listOfReasons = Object.values(payload).map((reason, key) => ({
            _id: key + 1,
            name: reason,
            checked: false
          }));
        }
        state.listOfReasonsStatus = 'success';
      })
      .addCase(thunks.getListOfReasons.rejected, (state) => {
        state.listOfReasonsStatus = 'fail';
      })
      
      .addCase(thunks.reportUser.pending, (state) => {
        state.reportUserStatus = 'pending';
      })
      .addCase(thunks.reportUser.fulfilled, (state) => {
        state.reportUserStatus = 'success';
      })
      .addCase(thunks.reportUser.rejected, (state) => {
        state.reportUserStatus = 'fail';
      })
      
      .addCase(HANDLE_USER, (state, { payload }) => {
        const activeRoute = Router.router.pathname === '/profile/[userId]';
        const currentUser = payload.id === state.profile?.user;
        if (activeRoute && currentUser) {
          changingUserDataWhoOnline(state, 'profile', payload);
        }
      })
      
      .addCase(userVoteThunks.setUserHeart.fulfilled, (state, { payload: { statusCode } }) => {
        if (Object.values(state.profile).length > 0 && statusCode === 200) {
          changingUserOrPhotoHeart(state.profile, 'likes', 'add');
        }
        
        if (Object.values(state.profile).length > 0 && statusCode === 202) {
          changingUserOrPhotoHeart(state.profile, 'likes', 'remove');
        }
      })
      
      .addCase(userVoteThunks.setUserLike.fulfilled, (state, { payload: { statusCode } }) => {
        if (Object.values(state.profile).length > 0 && statusCode === 200) {
          changingUserOrPhotoLike(state.profile, 'likes', 'add');
        }
  
        if (Object.values(state.profile).length > 0 && statusCode === 202) {
          changingUserOrPhotoLike(state.profile, 'likes', 'remove');
        }
      });
  },
});

const publicProfile = {
  actions: slice.actions,
  thunks,
  selectors,
};

export { publicProfile };
export default slice.reducer;
