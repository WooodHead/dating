import { useEffect, useState } from "react";
import LinkBack from "components/LinkBack";
import CardAttachment from "components/Cards/CardAttachment";
import ListEmpty from "components/ListEmpty";
import Loader from "components/Loader";
import ImagesGallery from "components/ImagesGallery";
import { publicPhotosByAlbum } from 'store/profile/public-photos-by-album';
import { photos } from 'store/photos'
import { useDispatch, useSelector } from "react-redux";
import cn from "classnames";
import styles from "./index.module.scss";

function PublicCurrentAlbum({ albumId, backToAlbums, albumInfo }) {
  const dispatch = useDispatch();
  const attachments = useSelector(publicPhotosByAlbum.selectors.photos);
  const photoStatus = useSelector(publicPhotosByAlbum.selectors.status);
  const [galleryIsVisible, setGalleryIsVisible] = useState(false);
  const [startIndexGallery, setStartIndexGallery] = useState(0);
  
  useEffect(() => {
    const getData = async () => {
      await dispatch(publicPhotosByAlbum.thunks.getPhotosByAlbum(albumId));
    }
    
    getData();
    
    return () => dispatch(publicPhotosByAlbum.actions.RESET_STATE())
  }, [])
  
  return (
    <>
      <div className="mb-4">
        <LinkBack
          text="Back to albums"
          onClick={backToAlbums}
        />
      </div>
  
      <div className={cn(styles.title, 'mt-4 mb-3')}>
        <div className="title-xs text-bold text-palatino mr-2">
          {albumInfo.name}
        </div>
        <div className={cn(styles['title__amount'], 'text-md color-grey-600 text-italic')}>
          {attachments.length} photos
        </div>
      </div>
      
      {photoStatus === 'success' ? (
        <div className={styles.list}>
          {attachments.map((attachment, idx) => (
            <CardAttachment
              key={attachment._id}
              attachment={attachment}
              onClick={() => {
                setStartIndexGallery(idx);
                setGalleryIsVisible(true);
              }}
              voteActions
            />
          ))}
          {!attachments.length && (
            <ListEmpty text="No results" />
          )}
        </div>
      ) : (
        <Loader />
      )}
      
      {galleryIsVisible && (
        <ImagesGallery
          images={attachments}
          startIndex={startIndexGallery}
          onClose={() => {
            setGalleryIsVisible(false);
            dispatch(photos.actions.RESET_STATE())
          }}
        />
      )}
    </>
  );
}

export default PublicCurrentAlbum;
