import {useEffect, useState} from "react";
import AccountPhotosLayout from "layouts/AccountPhotos";
import UploadPhoto from "components/Cards/UploadPhoto";
import CardAttachment from "components/Cards/CardAttachment";
import PopupConfirm from "components/Popups/PopupConfirm";
import { useForm } from "react-hook-form";
import styles from "./index.module.scss";
import MainLayout from 'layouts/Main';
import {prepareFormData} from "utils/preps";
import { userProfile } from "store/user/profile";
import { userPublicMainPhotos } from "store/user/public-main-photos";
import { photos } from 'store/photos'
import ImageGallery from "components/ImagesGallery";
import { useDispatch, useSelector } from "react-redux";
import cn from 'classnames'
import Loader from "components/Loader";
import PopupNotification from "components/Popups/PopupNotification";

MainPhotosPage.layouts = [MainLayout, AccountPhotosLayout]

function MainPhotosPage() {
  const { control } = useForm();
  const dispatch = useDispatch();

  const attachments = useSelector(userPublicMainPhotos.selectors.photos);
  const photoStatus = useSelector(userPublicMainPhotos.selectors.status);
  const addPhotoStatus = useSelector(userPublicMainPhotos.selectors.addPhotoStatus);
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
    <div>
      <div className="title-xs text-semibold mb-5 color-blue-900">
        Main Photos
      </div>
      {attachments.length && photoStatus === 'success' ? (
        <div className={cn(
          styles.list,
          'mb-4'
        )}>
          <div className="position-relative">
            <UploadPhoto
              name="photo"
              control={control}
              onChange={addPhoto}
              photosAmount={attachments.length}
            />
            <div className={cn(
              styles.limit,
            )}>
              Photo limit - {photoLimit} photos
            </div>
          </div>
          {attachments.map((attachment, idx) => (
            <CardAttachment
              key={attachment._id}
              attachment={attachment}
              btnDelete
              publicView={false}
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
      ) : (
        <div className="d-flex flex-column align-items-center">
          <div className="text-bitter title-xs color-grey-600 text-center mb-4">You don't have any photos </div>
          <div>
            <label className={cn(
              styles['upload-button'],
              'cursor-pointer'
            )}>
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={addPhoto}
              />
              <div className={cn(
                styles['upload__text'],
                'text-xl text-letter-1'
              )}>
                Upload photo
              </div>
            </label>
          </div>
        </div>
      )}

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
