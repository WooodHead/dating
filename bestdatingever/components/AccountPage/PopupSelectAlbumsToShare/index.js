import { useState } from "react";
import Button from "components/Button";
import IconButton from "components/IconButton";
import IconClose from "components/icons/IconClose";
import ShareAlbum from "./ShareAlbum";
import styles from "./index.module.scss";

function PopupSelectAlbumsToShare(
  {
    onConfirm,
    onClose
  }
) {
  const [albumsList, setAlbumsList] = useState([
    { id: 1, thumb: '', name: 'Name of the album', active: true },
    { id: 2, thumb: '', name: 'Name of the album', active: false },
    { id: 3, thumb: '', name: 'Name of the album', active: false },
  ]);

  const onSelectAlbum = (checked, album) => {
    setAlbumsList(arr => [...arr.map(item => {
      if (item.id === album.id) {
        return {
          ...item,
          active: checked
        }
      }
      return item
    })]);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <IconButton
          className={styles['icon-close']}
          onClick={onClose}
        >
          <IconClose/>
        </IconButton>
        <div className="text-lg text-semibold text-center mb-3">
          Select the albums you want to share
        </div>
        <div className="text-md mb-4">
          {albumsList.map(album => (
            <ShareAlbum
              key={album.id}
              album={album}
              onSelect={onSelectAlbum}
            />
          ))}
        </div>
        <div className={styles.actions}>
          <Button
            text="Continue"
            textSize="md"
            onClick={onConfirm}
          />
          <Button
            text="Cancel"
            textSize="md"
            outline
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}

export default PopupSelectAlbumsToShare;
