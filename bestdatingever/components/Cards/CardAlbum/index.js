import IconEdit from "components/icons/IconEdit";
import IconDelete from "components/icons/IconDelete";
import { useState } from "react";
import OutsideAlerter from "hooks/ClickOutside";
import cn from "classnames";
import styles from "./index.module.scss";

function CardAlbum(
  {
    album,
    className,
    editAlbum = false,
    onClick = () => {
    },
    onEdit = () => {
    },
    onDelete = () => {
    }
  }
) {
  
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
          src={album.thumb || album.titlePhoto || '/img/cards/card-bg-default.jpg'}
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
              <div
                className={styles['edit-menu']}
                onClick={() => setAddMenuIsVisible(true)}
              >
                <img src="/img/cards/icon-dots.svg" alt="" />
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
                          'd-flex align-items-center cursor-pointer'
                        )}
                             onClick={onEdit}
                        >
                          <IconEdit className="mr-1" />
                          Edit album
                        </div>
                        <div className={cn(
                          styles['delete-button'],
                          'd-flex align-items-center cursor-pointer'
                        )}
                             onClick={() => onDelete(album)}
                        >
                          <IconDelete className="mr-1" color="#4B5064" size="sm" />
                          Delete album
                        </div>
                      </div>
                      <div className={cn(
                        styles['edit__close'],
                        'cursor-pointer'
                      )}
                           onClick={() => setAddMenuIsVisible(false)}
                      >
                        <img src="/img/cards/icon-dots.svg" alt="" />
                      </div>
                    </div>
                  </div>
                </OutsideAlerter>
              )}
            </>
          )}
        </div>
      </div>
      <div className={cn(styles.name, 'text-word-break text-medium')}>{album.name}</div>
      <div className="text-uppercase text-default color-cyan-500">{album.amount} photos</div>
    </div>
  );
}

export default CardAlbum;
