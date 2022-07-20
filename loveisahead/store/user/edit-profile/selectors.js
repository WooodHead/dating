const selectors = {
  editProfileStatus: state => state.userEditProfile.editProfileStatus,
  changeEmailStatus: state => state.userEditProfile.changeEmailStatus,
  changePhoneStatus: state => state.userEditProfile.changePhoneStatus,
  changePasswordStatus: state => state.userEditProfile.changePasswordStatus,
  resetPasswordStatus: state => state.userEditProfile.resetPasswordStatus,
  createNewPasswordStatus: state => state.userEditProfile.createNewPasswordStatus,
  onResendStatus: state => state.userEditProfile.onResendStatus,
};

export { selectors };
