import { useEffect, useState } from "react";
import LinkBack from "components/LinkBack";
import CardAttachment from "components/Cards/CardAttachment";
import ListEmpty from "components/ListEmpty";
import Loader from "components/Loader";
import ImagesGallery from "components/ImagesGallery";
import MasonryComponent from "components/MasonryComponent";
import { publicPhotosByAlbum } from 'store/profile/public-photos-by-album'
import { useDispatch, useSelector } from "react-redux";

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
      <div className="d-flex align-items-center">
        <div className="text-xl text-bold">{albumInfo.name}</div>
        <div className="mx-1">-</div>
        <div className="text-italic">
          {attachments.length} photos
        </div>
      </div>
      
      {photoStatus === 'success' ? (
        <>
          {attachments.length > 0 && (
            <MasonryComponent>
              {attachments.map((attachment, idx) => (
                <CardAttachment
                  key={attachment.id}
                  attachment={attachment}
                  onClick={() => {
                    setStartIndexGallery(idx);
                    setGalleryIsVisible(true)
                  }}
                  voteActions
                />
              ))}
            </MasonryComponent>
          )}
          
          {!attachments.length && (
            <ListEmpty text="No results" />
          )}
        </>
      ) : (
        <Loader />
      )}
      
      {galleryIsVisible && (
        <ImagesGallery
          images={attachments}
          startIndex={startIndexGallery}
          onClose={() => setGalleryIsVisible(false)}
        />
      )}
    </>
  );
}

export default PublicCurrentAlbum;
