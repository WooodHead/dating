import { useEffect, useState } from "react";
import UploadPhoto from "components/Cards/UploadPhoto";
import CardAttachment from "components/Cards/CardAttachment";
import PopupConfirm from "components/Popups/PopupConfirm";
import PopupNotification from "components/Popups/PopupNotification";
import ImagesGallery from "components/ImagesGallery";
import MainLayout from 'layouts/Main';
import AccountProfileLayout from "layouts/AccountProfile";
import MasonryComponent from "components/MasonryComponent";
import { useForm } from "react-hook-form";
import { prepareFormData } from "utils/preps";
import { userPublicMainPhotos } from "store/user/public-main-photos";
import { userProfile } from "store/user/profile";
import { photos } from "store/photos";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.scss";

MainPhotosPage.layouts = [MainLayout, AccountProfileLayout];

function MainPhotosPage() {
  const { control } = useForm();
  const dispatch = useDispatch();
  
  const profile = useSelector(userProfile.selectors.profile);
  const profileStatus = useSelector(userProfile.selectors.profileStatus);
  const addPhotoStatus = useSelector(userPublicMainPhotos.selectors.addPhotoStatus);
  const attachments = useSelector(userPublicMainPhotos.selectors.photos);
  const deletePhotoStatus = useSelector(userPublicMainPhotos.selectors.deletePhotoStatus);
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
    if (attachments.length < photoLimit) {
      const file = prepareFormData({ photo })
      await dispatch(userPublicMainPhotos.thunks.addPhoto(file));
    } else {
      setPopupLimitPhoto(true);
    }
  }
  
  useEffect(() => {
    const getPhotos = async () => {
      await dispatch(userPublicMainPhotos.thunks.getPhotos(profile.user));
    }
    
    if (profileStatus === 'success') {
      getPhotos();
    }
  }, [profileStatus])
  
  useEffect(() => {
    if (addPhotoStatus === 'fail') {
      setTimeout(() => {
        dispatch(userPublicMainPhotos.actions.POP_PHOTOS())
      }, 5000);
    }
  }, [addPhotoStatus])
  
  return (
    <div className="position-relative pt-4 mb-4">
      <div className={styles.bg} />
      <MasonryComponent>
        <UploadPhoto
          name="photo"
          control={control}
          onChange={addPhoto}
          photosAmount={attachments.length}
          className="mb-3"
        />
        {attachments.map((attachment, idx) => (
          <CardAttachment
            key={attachment._id}
            attachment={attachment}
            btnDelete
            onDelete={(photoId) => {
              setPhotoId(photoId);
              setPopupConfirmIsVisible(true);
            }}
            onClick={() => {
              setImagesGalleryStartIndex(idx);
              setImagesGalleryIsVisible(true);
            }}
            className="mb-3"
          />
        ))}
      </MasonryComponent>
      
      {popupConfirmIsVisible && (
        <PopupConfirm
          onConfirm={submitDeletePhoto}
          onClose={closePopup}
          onCancel={closePopup}
          dark
          loader={deletePhotoStatus === 'pending'}
        >
          <div className="title-xs text-new-york text-medium mb-2">Caution</div>
          <div className="mb-4">Are you sure you want to delete photo?</div>
        </PopupConfirm>
      )}
      
      {popupLimitPhoto && (
        <PopupNotification
          dark
          onClose={() => setPopupLimitPhoto(false)}
        >
          <div className="d-flex text-lg text-bold mb-3">
            <img
              src="/img/popups/icon-attention.svg"
              alt=""
              className="icon-default mr-1"
            />
            <div>OOops, you reached photo limit.</div>
          </div>
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
