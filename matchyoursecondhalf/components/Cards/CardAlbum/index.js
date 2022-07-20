import IconButton from "components/IconButton";
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
    selected = false,
    onEdit = () => {},
    onDelete = () => {}
  }
) {
  return (
    <div>
      <div
        className={cn(
          styles.card,
          {[styles['card__active']]: selected},
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
            <div className={styles['permissions__icon']}>
              <img
                src="/img/cards/icon-permissions.svg"
                alt=""
                className="mb-1"
              />
            </div>
            <div className={cn(
              styles['permissions__text'],
              'text-md text-semibold text-letter-0-3 color-white mt-4'
            )}>
              Ask permission
            </div>
          </div>
        )}
        <div className={styles.content}>
          {editAlbum && (
            <div className={cn(
              styles.edit,
              {[styles['edit--active']]: selected}
            )}>
              <div className={styles.check}>
                <img
                  src="/img/buttons/icon-check.svg"
                  alt=""
                  className={styles['check__icon']}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="pt-2 px-2">
        <div className="text-word text-semibold mb-1 color-blue-900">{album.name}</div>
        <div className="color-grey-600">{album.amount} photos</div>
      </div>
    </div>
  );
}

export default CardAlbum;
