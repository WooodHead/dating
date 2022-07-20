import { createSlice } from "@reduxjs/toolkit";
import { thunks } from "./thunks";
import { selectors } from "./selectors";
import Person from "resources/Cards/PersonCard";
import { changingUserDataWhoOnline } from "utils/userActions";
import { usersOnline } from "store/online";
import Router from "next/router";
import { thunks as userVoteThunks } from "store/vote/thunks";
import { changingUserOrPhotoHeart, changingUserOrPhotoLike } from "utils/userVote";

const { HANDLE_USER } = usersOnline.actions;

const initialState = {
  profiles: [],
  status: 'idle',
  statusMore: 'success',
  pagination: {
    current: 12,
    take: 12,
    offset: 0,
  },
};

const findIdxCurrentProfile = (profiles, targetUserId) => {
  return profiles.findIndex(profile => profile.user === targetUserId);
};

const slice = createSlice({
  name: 'usersProfiles',
  initialState: { ...initialState },
  reducers: {
    RESET_STATE: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(thunks.getUsersProfiles.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(thunks.getUsersProfiles.fulfilled, (state, { payload }) => {
        state.profiles = payload.map(person => {
          const user = new Person({
            ...person.profile,
            likes: {
              ...person.likes.count,
              ...person.likes.likeRelation,
            },
            distance: person.distance,
          });
          return user.getPerson();
        });
        state.pagination = {
          ...state.pagination,
          offset: state.pagination.offset + state.pagination.current
        };
        state.status = 'success';
      })
      .addCase(thunks.getUsersProfiles.rejected, (state) => {
        state.status = 'fail';
      })
      .addCase(thunks.loadMore.pending, (state) => {
        state.statusMore = 'pending';
      })
      .addCase(thunks.loadMore.fulfilled, (state, { payload }) => {
        const newProfiles = payload.map(person => {
          const user = new Person({
            ...person.profile,
            likes: {
              ...person.likes.count,
              ...person.likes.likeRelation,
            }
          });
          return user.getPerson();
        });

        state.profiles.push(...newProfiles);
        state.pagination = {
          ...state.pagination,
          offset: state.pagination.offset + state.pagination.current
        };

        if (!newProfiles.length) state.statusMore = 'idle';
        else state.statusMore = 'success';
      })
      .addCase(thunks.loadMore.rejected, (state) => {
        state.statusMore = 'fail';
      })

      .addCase(HANDLE_USER, (state, { payload }) => {
        const activeRoute = Router.router.pathname === '/';
        const profileIdx = state.profiles.findIndex(profile => profile.user === payload.id);

        if (activeRoute && profileIdx !== -1) {
          changingUserDataWhoOnline(state.profiles, profileIdx, payload);
        }
      })

      .addCase(userVoteThunks.setUserHeart.fulfilled, (state, { payload: { statusCode, targetUserId } }) => {
        if (state.profiles.length > 0 && statusCode === 200) {
          const idx = findIdxCurrentProfile(state.profiles, targetUserId);
          if (idx !== -1) changingUserOrPhotoHeart(state.profiles[idx], 'likes', 'add');
        }

        if (state.profiles.length > 0 && statusCode === 202) {
          const idx = findIdxCurrentProfile(state.profiles, targetUserId);
          if (idx !== -1) changingUserOrPhotoHeart(state.profiles[idx], 'likes', 'remove');
        }
      })

      .addCase(userVoteThunks.setUserLike.fulfilled, (state, { payload: { statusCode, targetUserId } }) => {
        if (state.profiles.length > 0 && statusCode === 200) {
          const idx = findIdxCurrentProfile(state.profiles, targetUserId);
          if (idx !== -1) changingUserOrPhotoLike(state.profiles[idx], 'likes', 'add');
        }

        if (state.profiles.length > 0 && statusCode === 202) {
          const idx = findIdxCurrentProfile(state.profiles, targetUserId);
          if (idx !== -1) changingUserOrPhotoLike(state.profiles[idx], 'likes', 'remove');
        }
      });
  },
});

const usersProfiles = {
  actions: slice.actions,
  thunks,
  selectors,
};

export { usersProfiles };
export default slice.reducer;
