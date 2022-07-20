import {useEffect, useState} from "react";
import AccountPhotosLayout from "layouts/AccountPhotos";
import UploadPhoto from "components/Cards/UploadPhoto";
import CardAttachment from "components/Cards/CardAttachment";
import PopupConfirm from "components/Popups/PopupConfirm";
import PopupNotification from "components/Popups/PopupNotification";
import ImagesGallery from "components/ImagesGallery";
import { useForm } from "react-hook-form";
import styles from "./index.module.scss";
import MainLayout from 'layouts/Main';
import { prepareFormData } from "utils/preps";
import { userPublicMainPhotos } from "store/user/public-main-photos";
import { userProfile } from "store/user/profile";
import { photos } from "store/photos";
import { useDispatch, useSelector } from "react-redux";

MainPhotosPage.layouts = [MainLayout, AccountPhotosLayout]

function MainPhotosPage() {
  const { control } = useForm();
  const dispatch = useDispatch();

  const profile = useSelector(userProfile.selectors.profile);
  const profileStatus = useSelector(userProfile.selectors.profileStatus);
  const addPhotoStatus = useSelector(userPublicMainPhotos.selectors.addPhotoStatus);
  const attachments = useSelector(userPublicMainPhotos.selectors.photos);
  const photoLimit = 9;

  const [popupConfirmIsVisible, setPopupConfirmIsVisible] = useState(false);
  const [popupLimitPhoto, setPopupLimitPhoto] = useState(false);
  const [photoId, setPhotoId] = useState(null);
  const [imagesGalleryIsVisible, setImagesGalleryIsVisible] = useState(false);
  const [imagesGalleryStartIndex, setImagesGalleryStartIndex] = useState(0);



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
      const file = prepareFormData({photo})
      await dispatch(userPublicMainPhotos.thunks.addPhoto(file));
    } else {
     setPopupLimitPhoto(true);
    }
  }

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

  return (
    <div className="mb-4">
      <div className="text-md text-italic color-blue-700 mb-1">
        Photo limit - 9 photos
      </div>
      <div className={styles.list}>
        <UploadPhoto
          name="photo"
          control={control}
          onChange={addPhoto}
          photosAmount={attachments.length}
        />
        {attachments.map((attachment, idx) => (
          <div
            key={attachment._id}
            onClick={() => {
              setImagesGalleryStartIndex(idx);
              setImagesGalleryIsVisible(true);
            }}
          >
            <CardAttachment
              attachment={attachment}
              btnDelete
              onDelete={(photoId) => {
                setPhotoId(photoId);
                setPopupConfirmIsVisible(true);
              }}
            />
          </div>
        ))}
      </div>

      {popupConfirmIsVisible && (
        <PopupConfirm
          onClose={closePopup}
          onConfirm={submitDeletePhoto}
          onCancel={closePopup}
        >
          Are you sure you want to delete photo?
        </PopupConfirm>
      )}
      {popupLimitPhoto && (
        <PopupNotification
          textSize="md"
          onClose={() => setPopupLimitPhoto(false)}
          title={(
            <div className="title-xs text-bold mb-1">
              <img
                src="/img/popups/icon-attention.svg"
                alt=""
                className="mr-2"
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
      {imagesGalleryIsVisible && (
        <ImagesGallery
          images={attachments}
          startIndex={imagesGalleryStartIndex}
          onClose={() => {
            setImagesGalleryIsVisible(false);
            dispatch(photos.actions.RESET_STATE());
          }}
        />
      )}
    </div>
  );
}

export default MainPhotosPage;
