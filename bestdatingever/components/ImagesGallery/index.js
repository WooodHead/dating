import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import IconButton from "components/IconButton";
import IconClose from "components/icons/IconClose";
import styles from "./index.module.scss";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import { photos } from 'store/photos';

function ImagesGallery(
  {
    images,
    startIndex,
    onClose,
    showThumbnails = false,
    showFullscreenButton= false,
    showPlayButton = false,
    showNav = true,
  }
) {
  const dispatch = useDispatch();

  const photosById = useSelector(photos.selectors.photosById);
  const [showCloseBtn, setShowCloseBtn] = useState(false);
  const [index, setIndex] = useState(startIndex);


  const onImageLoad = () => {
    setShowCloseBtn(true)
  }

  const setPhotoByIndex = async (nextIndex) => {
    await dispatch(photos.thunks.getPhotoById({photoId: images[nextIndex ]._id, index: nextIndex}));
  }

  const onBeforeSlide = async (nextIndex) => {
    await setPhotoByIndex(nextIndex);
    setIndex(nextIndex);
  }

  useEffect(() => {
    const initialization = async () => {
      dispatch(photos.actions.SET_PHOTOS_LENGTH(images.length));
      dispatch(photos.thunks.getPhotoById({photoId: images[startIndex]._id, index: startIndex}))
    }

    initialization();
  }, [])

  return (
    <div className={styles.overlay}>
      <div className={styles.gallery}>
        <div className={styles['btn-close']}>
          {showCloseBtn && (
            <IconButton onClick={onClose}>
              <IconClose
                color="white"
                size="lg"
                className={styles['icon-close']}
              />
            </IconButton>
          )}
        </div>
          <ImageGallery
            items={photosById}
            startIndex={index}
            showNav={showNav}
            showThumbnails={showThumbnails}
            showFullscreenButton={showFullscreenButton}
            showPlayButton={showPlayButton}
            onImageLoad={onImageLoad}
            onBeforeSlide={onBeforeSlide}
          />
      </div>
    </div>
  );
}

export default ImagesGallery;
