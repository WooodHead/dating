import { useMemo } from "react";
import IconButton from "components/IconButton";
import IconEdit from "components/icons/IconEdit";
import IconDelete from "components/icons/IconDelete";
import IconUsers from "components/icons/IconUsers";
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
                        <IconDelete/>
                    </IconButton>
                    {isPrivateAlbum && (
                        <IconButton
                            color="rgba(47, 48, 73, 0.5)"
                            padding={13}
                            onClick={() => onShareUsers(album)}
                        >
                            <IconUsers/>
                        </IconButton>
                    )}
                </div>
            </div>
          )}
        </div>
      </div>
      <div className="pt-2 px-2">
        <div className="text-break-word mb-1">{album.name}</div>
        <div>{album.amount} photos</div>
      </div>
    </div>
  );
}

export default CardAlbum;
