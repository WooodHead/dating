import { useEffect, useState } from "react";
import SliderComponent from "components/SliderComponent";
import CardAttachment from "components/Cards/CardAttachment";
import { userProfile } from "store/user/profile";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { publicPhotos } from "store/profile/public-photos";
import { photos } from "store/photos";
import { windowActions } from "store/windowActions";
import { mediaSizes } from "utils/constants";
import Loader from "components/Loader";
import ListEmpty from "components/ListEmpty";
import ImagesGallery from "components/ImagesGallery";
import styles from "./index.module.scss";

function PublicMainPhotos() {
  const router = useRouter();
  const dispatch = useDispatch();

  const userId = router.query.userId;
  const mainPhotos = useSelector(publicPhotos.selectors.photos);
  const mainPhotosStatus = useSelector(publicPhotos.selectors.status);
  const { isPremiumUser } = useSelector(userProfile.selectors.profile);
  const [galleryIsVisible, setGalleryIsVisible] = useState(false);
  const { width: windowWidth } = useSelector(windowActions.selectors.windowSize)
  const [startGalleryIndex, setStartGalleryIndex] = useState(0);
  const [extraSettings, setExtraSettings] = useState({
    slidesToShow: 5,
    slidesToScroll: 1,
    infinite: mainPhotos.length > 5
  })

  const slideToShow = (width) => {
    switch (true) {
      case(width >= mediaSizes.md):
        return 5
      case(width >= mediaSizes.sm):
        return 4
      case(width >= mediaSizes.xs):
        return 3
      case(width <= mediaSizes.xs):
        return 2
      default:
        return 5
    }
  }

  useEffect(() => {
    setExtraSettings(prevState => ({...prevState, slidesToShow: slideToShow(windowWidth)}))

  }, [windowWidth])
  
  useEffect(() => {
    const getPhotos = async () => {
      await dispatch(publicPhotos.thunks.getPhotos(userId));
    }

    getPhotos();
  }, []);

  
  if (['idle', 'pending'].includes(mainPhotosStatus)) return <Loader/>
  if (mainPhotos.length <= 0) return <ListEmpty text="No results"/>
  
  return (
    <>
      <div className={styles.wrap}>
        <SliderComponent
          extraSettings={extraSettings}
        >
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
        </SliderComponent>
      </div>
      
      {galleryIsVisible && (
        <ImagesGallery
          images={mainPhotos}
          startIndex={startGalleryIndex}
          showNav={isPremiumUser}
          onClose={() => {
            setGalleryIsVisible(false);
            dispatch(photos.actions.RESET_STATE())
          }}
        />
      )}
    </>
  );
}

export default PublicMainPhotos;
