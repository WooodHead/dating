import cn from "classnames";
import styles from './index.module.scss'

function AddAlbumCard (
  {
    onClick
  }
) {
  return (
    <div className={styles.wrap} onClick={onClick}>
      <div className={styles.content}>
        <img
          src="/img/cards/icon-add-album.svg"
          alt="Add album"
          className={cn(
            styles.img,
            'mb-3'
          )}
        />
        <div className={cn(
          styles.label,
          'text-md text-semibold text-letter-1 color-grey-600'
        )}>
          Add new album
        </div>
      </div>
    </div>
  )
}

export default AddAlbumCard