const selectors = {
  settings: state => state.userSettings.settings,
  status: state => state.userSettings.status,
  saveSettingsStatus: state => state.userSettings.saveSettingsStatus,
};

export { selectors };
