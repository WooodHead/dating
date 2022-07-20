import IconButton from "components/IconButton";
import IconClose from "components/icons/IconClose";
import Avatar from "components/Avatar";
import cn from "classnames";
import styles from "../_shared/index.module.scss";

function AlbumNotification(
  {
    idx,
    notification,
    onReject = () => {},
    onAccept = () => {},
    onDelete = () => {},
  }
) {
  const deleteNotification = (e) => {
    e.stopPropagation();
    onDelete(notification._id)
  };

  const gotToAlbum = () => {
    console.log(notification)
  }
  
  return (
    <div className={cn(
      styles.notification,
      styles[`cascade--order-${idx + 1}`],
      'text-md'
    )}
      onClick={gotToAlbum}
    >
      <IconButton
        className={styles['icon-close']}
        onClick={deleteNotification}
      >
        <IconClose/>
      </IconButton>
      <div className="d-flex align-items-start mb-2">
        <Avatar
          className="mr-1"
          name={notification.profile.name}
          thumb={notification.profile.avatarPath}
          isOnline={notification.profile.online}
        />
        <div>
          <div className={cn(styles.title, 'text-bold')}>The album was shared with you</div>
          <div>User {notification.profile.name} Shared album with you {notification.album.name}</div>
        </div>
      </div>
      {/*<div className="d-flex align-items-center justify-content-center">*/}
      {/*  <div*/}
      {/*    className="text-xl text-semibold cursor-pointer"*/}
      {/*    onClick={() => onReject()}*/}
      {/*  >*/}
      {/*    Reject*/}
      {/*  </div>*/}
      {/*  <div className={styles.line}/>*/}
      {/*  <div*/}
      {/*    className="text-xl text-semibold cursor-pointer"*/}
      {/*    onClick={() => onAccept()}*/}
      {/*  >*/}
      {/*    Accept*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
}

export default AlbumNotification;
