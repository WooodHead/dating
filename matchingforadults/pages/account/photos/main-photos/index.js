import { useEffect, useState } from "react";
import UploadPhoto from "components/Cards/UploadPhoto";
import CardAttachment from "components/Cards/CardAttachment";
import PopupConfirm from "components/Popups/PopupConfirm";
import { useForm } from "react-hook-form";
import MainLayout from 'layouts/Main';
import { prepareFormData } from "utils/preps";
import { userProfile } from "store/user/profile";
import { useDispatch, useSelector } from "react-redux";
import Loader from "components/Loader";
import { userPublicMainPhotos } from "store/user/public-main-photos";
import { photos } from "store/photos";
import PopupNotification from "components/Popups/PopupNotification";
import ImageGallery from "components/ImagesGallery";
import styles from "./index.module.scss";

MainPhotosPage.layouts = [MainLayout]

function MainPhotosPage() {
  const { control } = useForm();
  const dispatch = useDispatch();

  const attachments = useSelector(userPublicMainPhotos.selectors.photos);
  const photoStatus = useSelector(userPublicMainPhotos.selectors.status);
  const addPhotoStatus = useSelector(userPublicMainPhotos.selectors.addPhotoStatus);
  const deletePhotoStatus = useSelector(userPublicMainPhotos.selectors.deletePhotoStatus);
  const profile = useSelector(userProfile.selectors.profile);
  const profileStatus = useSelector(userProfile.selectors.profileStatus);

  const [popupConfirmIsVisible, setPopupConfirmIsVisible] = useState(false);
  const [popupLimitPhoto, setPopupLimitPhoto] = useState(false);
  const [photoId, setPhotoId] = useState(null);
  const [imageGalleryIsVisible, setImageGalleryIsVisible] = useState(false);
  const [startGalleryIndex, setStartGalleryIndex] = useState(0);
  const photoLimit = 9;

  useEffect(() => {
    const getPhotos = async () => {
      await dispatch(userPublicMainPhotos.thunks.getPhotos(profile.user));
    }

    if(profileStatus === 'success') {
      getPhotos();
    }
  }, [profileStatus])

  useEffect(() => {
    if(addPhotoStatus === 'fail') {
      setTimeout(() => {
        dispatch(userPublicMainPhotos.actions.POP_PHOTOS())
      }, 5000);
    }
  }, [addPhotoStatus])

  const closePopup = () => {
    setPhotoId(null);
    setPopupConfirmIsVisible(false);
  };

  const submitDeletePhoto = async () => {
    await dispatch(userPublicMainPhotos.thunks.deletePhoto(photoId));
    setPopupConfirmIsVisible(false);
  };

  const addPhoto = async (photo) => {
    if(attachments.length < photoLimit) {
      let file = null;

      if(photo.hasOwnProperty('target')) {
        file = prepareFormData({photo: photo.target.files[0]})
      } else {
        file = prepareFormData({photo})
      }

      await dispatch(userPublicMainPhotos.thunks.addPhoto(file));
    } else {
      setPopupLimitPhoto(true);
    }
  }

  if(['idle', 'pending'].includes(photoStatus)) return <Loader />

  return (
    <div className="mb-4">
      <div className="d-flex align-items-center mb-3">
        <div className="title-xs text-bold text-palatino mr-2">
          Main photos
        </div>
        <div className="text-md text-italic color-grey-600 mb-1">
          photo limit - 9 photos
        </div>
      </div>
      
      <div className={styles.list}>
        <UploadPhoto
          name="photo"
          control={control}
          onChange={addPhoto}
          photosAmount={attachments.length}
        />
        {attachments.map((attachment, idx) => (
          <CardAttachment
            key={attachment._id}
            attachment={attachment}
            btnDelete
            onClick={() => {
              setStartGalleryIndex(idx);
              setImageGalleryIsVisible(true);
            }}
            onDelete={(photoId) => {
              setPhotoId(photoId);
              setPopupConfirmIsVisible(true);
            }}
          />
        ))}
      </div>

      {popupConfirmIsVisible && (
        <PopupConfirm
          onClose={closePopup}
          onConfirm={submitDeletePhoto}
          onCancel={closePopup}
          loader={deletePhotoStatus === 'pending'}
        >
          <div className="text-center">
            Are you sure you want to delete photo?
          </div>
        </PopupConfirm>
      )}
      
      {popupLimitPhoto && (
        <PopupNotification
          textSize="md"
          onClose={() => setPopupLimitPhoto(false)}
          title={(
            <div className="text-lg text-bold mb-3">
              <img
                src="/img/popups/icon-attention.svg"
                alt=""
                className="icon-default mr-2"
              />
              OOops, you reached photo limit.
            </div>
          )}
        >
          <div>
            If you want to upload a new photo, you should delete
            one of the previous photos.
          </div>
        </PopupNotification>
      )}

      {imageGalleryIsVisible && (
        <ImageGallery
          images={attachments}
          startIndex={startGalleryIndex}
          onClose={() => {
            setImageGalleryIsVisible(false)
            dispatch(photos.actions.RESET_STATE())
          }}
        />
      )}
    </div>
  );
}

export default MainPhotosPage;
