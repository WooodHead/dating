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
    onEdit = () => {},
    onDelete = () => {}
  }
) {
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
            <img
              src="/img/cards/icon-permissions.svg"
              alt=""
              className="mb-1"
            />
            <div className="text-bold color-white">
              Ask permission
            </div>
          </div>
        )}
        
        <div className={styles.content}>
          {editAlbum && (
            <div className={styles.edit}>
              <div className="d-flex align-items-center">
                <IconButton
                  color="rgba(47, 48, 73, 0.5)"
                  padding={13}
                  onClick={onEdit}
                >
                  <IconEdit/>
                </IconButton>
                <IconButton
                  color="rgba(47, 48, 73, 0.5)"
                  padding={13}
                  onClick={() => onDelete(album)}
                >
                  <IconDelete size="sm"/>
                </IconButton>
              </div>
            </div>
          )}
  
          <div className={cn(styles.info, 'color-white')}>
            <div className="text-xl text-semibold text-break-word mb-1">
              {album.name}
            </div>
            <div className="d-flex align-items-center">
              <div className="text-italic text-md mr-1">{album.amount} photos</div>
              <img src="/img/cards/icon-chevron-circle.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardAlbum;
