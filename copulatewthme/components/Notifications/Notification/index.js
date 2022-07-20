import { notificationTypes } from "utils/constants";
import ChatNotification from "./Chat";
import AlbumNotification from "./Album";

const notificationTypesAsArray = Object.values(notificationTypes)
const notificationComponents = {
  [notificationTypes.CHAT]: ChatNotification,
  [notificationTypes.ALBUM]: AlbumNotification,
}

function Notification({ notification, ...rest }) {
  if (!notificationTypesAsArray.includes(notification.type)) return null // return layout for 'broken' notification
  
  const NotificationComponent = notificationComponents[notification.type]
  return <NotificationComponent notification={notification} {...rest}/>
}

export default Notification;
