import { useMemo, useState } from "react";
import OutsideAlerter from "hooks/ClickOutside";
import IconUsers from "components/icons/IconUsers";
import IconEdit from "components/icons/IconEdit";
import IconDelete from "components/icons/IconDelete";
import cn from "classnames";
import styles from "./index.module.scss";

function CardAlbum(
  {
    album,
    className,
    editAlbum = false,
    onClick = () => {},
    onEdit = () => {},
    onDelete = () => {},
    onShareUsers = () => {},
  }
) {
  const isPrivateAlbum = useMemo(() => album.type === "Private", [album.type]);

  const [addMenuIsVisible, setAddMenuIsVisible] = useState(false);

  return (
    <div>
      <div
        className={cn(
          styles.card,
          className,
          { 'cursor-pointer': !editAlbum }
        )}
        onClick={() => onClick(album.id)}
      >
        <img
          src={album.thumb || album.titlePhoto || '/img/cards/card-bg-default.png'}
          alt={album.name}
          className={styles.thumbnail}
        />
        {!album.permission && (
          <div className={styles.permissions}>
            <div className={cn(
              styles['permissions__img'],
              'mb-1'
            )}>
              <img
                src="/img/cards/icon-permissions.svg"
                alt=""
              />
            </div>
            <div className={cn(
              styles['permissions__text'],
              'text-semibold text-lg color-white mt-5'
            )}>
              Ask permission to view
            </div>
          </div>
        )}
        <div className={styles.content}>
          {editAlbum && (
            <>
              <div className={styles['edit-menu']}
                onClick={() => setAddMenuIsVisible(true)}
              >
                <img src="/img/cards/icon-dots.svg" alt=""/>
              </div>
              {addMenuIsVisible && (
                <OutsideAlerter
                  close={() => setAddMenuIsVisible(false)}
                >
                  <div className={styles.edit}>
                    <div className="d-flex align-items-start">
                      <div className="d-flex flex-column">
                        <div className={cn(
                          styles['edit-button'],
                          'd-flex justify-content-between align-items-center cursor-pointer'
                        )}
                          onClick={onEdit}
                        >
                          <IconEdit className="mr-1"/>
                          Edit album
                        </div>
                        <div className={cn(
                          styles['delete-button'],
                          'd-flex justify-content-between align-items-center cursor-pointer'
                        )}
                          onClick={() => onDelete(album)}
                        >
                          <IconDelete className="mr-1"/>
                          Delete album
                        </div>
                          {isPrivateAlbum && (
                              <div className={cn(
                                  styles['delete-button'],
                                  'd-flex justify-content-between align-items-center cursor-pointer'
                              )}
                                   onClick={() => onShareUsers(album._id)}
                              >
                                  <IconUsers className="mr-1"/>
                                  Shared for
                              </div>
                          )}
                      </div>
                    </div>
                  </div>
                </OutsideAlerter>
              )}
            </>
          )}
        </div>
      </div>
      <div className="mt-1 color-blue-900">
        <div className="text-word-break mb-1 text-semibold text-lg">{album.name}</div>
        <div className="text-italic text-md">{album.amount} photos</div>
      </div>
    </div>
  );
}

export default CardAlbum;
