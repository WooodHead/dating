const selectors = {
  profile: state => state.userProfile.profile,
  profileStatus: state => state.userProfile.profileStatus,
  avatarStatus: state => state.userProfile.avatarStatus,
  albumStatus: state => state.userProfile.albumStatus,
  photoStatus: state => state.userProfile.photoStatus,
  isPremiumPopupActive: state => state.userProfile.isPremiumPopupActive,
};

export { selectors };
