import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "api";
import requestProcessing from "services/requestsProcessing";

const getNotifications = createAsyncThunk('user/get-notifications', async () => {
  try {
    const res = await api.userNotifications.getNotifications();
    return res.data;
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const deleteNotification = createAsyncThunk('user/delete-notification', async (notificationId) => {
  try {
    const res = await api.userNotifications.deleteNotification(notificationId);
    return { ...res.data, notificationId };
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const deleteAllNotifications = createAsyncThunk('user/delete-all-notifications', async () => {
  try {
    const res = await api.userNotifications.deleteAllNotifications();
    return res.data;
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const thunks = {
  getNotifications,
  deleteNotification,
  deleteAllNotifications,
};

export { thunks };
