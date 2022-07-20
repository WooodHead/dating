const selectors = {
  profile: state => state.userProfile.profile,
  profileStatus: state => state.userProfile.profileStatus,
  avatarStatus: state => state.userProfile.avatarStatus,
  isPremiumPopupActive: state => state.userProfile.isPremiumPopupActive,
};

export { selectors };
