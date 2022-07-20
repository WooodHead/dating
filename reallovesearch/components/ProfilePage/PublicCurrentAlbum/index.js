import { useEffect, useState } from "react";
import LinkBack from "components/LinkBack";
import CardAttachment from "components/Cards/CardAttachment";
import ListEmpty from "components/ListEmpty";
import { publicPhotosByAlbum } from 'store/profile/public-photos-by-album';
import { photos } from 'store/photos'
import styles from "./index.module.scss";
import { useDispatch, useSelector } from "react-redux";
import Loader from "components/Loader";
import ImagesGallery from "components/ImagesGallery";

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
    <div className="pt-3">
      <div className="mb-4">
        <LinkBack
          text="Back to albums"
          onClick={backToAlbums}
        />
      </div>
      <div className="text-xl text-medium mb-1 text-poppins text-uppercase">
        {albumInfo.name}
      </div>
      <div className="mb-3">
        {attachments.length} photos
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
            <ListEmpty text="No results"/>
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
    </div>
  );
}

export default PublicCurrentAlbum;
