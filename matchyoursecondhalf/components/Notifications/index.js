import OutsideAlerter from "hooks/ClickOutside";
import { userNotifications } from "store/notifications";
import { useDispatch, useSelector } from "react-redux";
import Notification from "./Notification";
import ListEmpty from "components/ListEmpty";
import Button from "components/Button";
import cn from "classnames";
import styles from "./index.module.scss";

function Notifications({ onClose }) {
  const dispatch = useDispatch();
  const list = useSelector(userNotifications.selectors.list);
  const deleteAllNotificationsStatus = useSelector(userNotifications.selectors.deleteAllNotificationsStatus);
  
  const onReject = () => {
    console.log('=> onReject');
  };
  
  const onAccept = () => {
    console.log('=> onAccept');
  };
  
  const onDelete = (notificationId) => {
    dispatch(userNotifications.thunks.deleteNotification(notificationId));
  };
  
  const onClearAll = () => {
    dispatch(userNotifications.thunks.deleteAllNotifications());
  };
  
  return (
    <OutsideAlerter close={onClose}>
      {list.length <= 5 ? (
        <div className={styles.wrap}>
          {list.length > 0 ? (
            list.map(notification => (
              <Notification
                key={notification._id}
                notification={notification}
                onReject={onReject}
                onAccept={onAccept}
                onDelete={onDelete}
                onClose={onClose}
              />
            ))
          ) : (
            <div className="py-2">
              <ListEmpty text="No results" className={styles['list-empty']}/>
            </div>
          )}
          {list.length > 0 && (
            <div className="px-4 py-3 mt-auto">
              <Button
                text="Clear All"
                loader={deleteAllNotificationsStatus === 'pending'}
                fullWidth
                dark
                onClick={onClearAll}
              />
            </div>
          )}
        </div>
      ) : (
        <div className={styles.cascade}>
          <div className="d-flex justify-content-end">
            <div
              className={cn(
                styles['cascade__btn-clear'],
                'text-md text-semibold px-2 py-1 cursor-pointer'
              )}
              onClick={onClearAll}
            >
              Clear All
            </div>
          </div>
          {list.map((notification, key) => (
            <Notification
              key={notification._id}
              idx={key}
              notification={notification}
              onDelete={onDelete}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </OutsideAlerter>
  );
}

export default Notifications;
