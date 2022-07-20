const selectors = {
  list: state => state.userNotifications.list,
  listCount: state => state.userNotifications.listCount,
  listStatus: state => state.userNotifications.listStatus,
  listIsVisible: state => state.userNotifications.listIsVisible,
  deleteAllNotificationsStatus: state => state.userNotifications.deleteAllNotificationsStatus,
};

export { selectors };
