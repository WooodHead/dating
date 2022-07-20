import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { publicPhotos } from "store/profile/public-photos";
import { userProfile } from "store/user/profile";
import Loader from "components/Loader";
import ListEmpty from "components/ListEmpty";
import ImagesGallery from "components/ImagesGallery";
import Username from "../PublicDescription/Username";
import MasonryComponent from "components/MasonryComponent";
import CardAttachment from "components/Cards/CardAttachment";

function PublicMainPhotos() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userId = router.query.userId;
  const mainPhotos = useSelector(publicPhotos.selectors.photos);
  const mainPhotosStatus = useSelector(publicPhotos.selectors.status);
  const { isPremiumUser } = useSelector(userProfile.selectors.profile);
  const [imagesGalleryIsVisible, setImagesGalleryIsVisible] = useState(false);
  const [imagesGalleryStartIndex, setImagesGalleryStartIndex] = useState(0);
  
  useEffect(() => {
    const getPhotos = async () => {
      await dispatch(publicPhotos.thunks.getPhotos(userId));
    }
    getPhotos()
    
  }, []);
  
  if (['idle', 'pending'].includes(mainPhotosStatus)) return <Loader />
  if (mainPhotos.length <= 0) return <ListEmpty text="No results" />
  
  return (
    <>
      <Username />
      
      <MasonryComponent>
        {mainPhotos.map((attachment, key) => (
          <CardAttachment
            key={attachment._id}
            attachment={attachment}
            isBlurred={attachment.isBlurred}
            onClick={() => {
              setImagesGalleryStartIndex(key);
              setImagesGalleryIsVisible(true);
            }}
            voteActions
            index={key}
          />
        ))}
      </MasonryComponent>
      
      {imagesGalleryIsVisible && (
        <ImagesGallery
          images={mainPhotos}
          startIndex={imagesGalleryStartIndex}
          showNav={isPremiumUser}
          onClose={() => setImagesGalleryIsVisible(false)}
        />
      )}
    </>
  );
}

export default PublicMainPhotos;
