import { useEffect, useState } from "react";
import CardAttachment from "components/Cards/CardAttachment";
import PublicAlbumsHead from "components/ProfilePage/PublicAlbumsHead";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { userProfile } from "store/user/profile";
import { publicPhotos } from "store/profile/public-photos";
import Loader from "components/Loader";
import ListEmpty from "components/ListEmpty";
import ImagesGallery from "components/ImagesGallery";
import styles from "./index.module.scss";
import { photos } from "store/photos";

function PublicMainPhotos() {
  const router = useRouter();
  const dispatch = useDispatch();

  const userId = router.query.userId;
  const mainPhotos = useSelector(publicPhotos.selectors.photos);
  const mainPhotosStatus = useSelector(publicPhotos.selectors.status);
  const { isPremiumUser } = useSelector(userProfile.selectors.profile);;
  const [galleryIsVisible, setGalleryIsVisible] = useState(false);
  const [startGalleryIndex, setStartGalleryIndex] = useState(0);

  useEffect(() => {
    const getPhotos = async () => {
      await dispatch(publicPhotos.thunks.getPhotos(userId));
    }

    if(userId) {
      getPhotos();
    }

  }, [userId]);

  if (['idle', 'pending'].includes(mainPhotosStatus)) return <Loader/>

  return (
    <>
      <PublicAlbumsHead>Main photos</PublicAlbumsHead>
      {mainPhotos.length ? (
        <div className={styles.list}>
          {mainPhotos.map((attachment, key) => (
            <CardAttachment
              key={attachment._id}
              attachment={attachment}
              isBlurred={attachment.isBlurred}
              onClick={() => {
                setStartGalleryIndex(key);
                setGalleryIsVisible(true);
              }}
              voteActions
              index={key}
            />
          ))}
        </div>
      ) : (
        <div className="mt-3">
          <ListEmpty text="No results"/>
        </div>
      )}

      {galleryIsVisible && (
        <ImagesGallery
          images={mainPhotos}
          startIndex={startGalleryIndex}
          showNav={isPremiumUser}
          onClose={() => {
            setGalleryIsVisible(false);
            dispatch(photos.actions.RESET_STATE());
          }}
        />
      )}
    </>
  );
}

export default PublicMainPhotos;
