import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { defaultValues, schema } from "./config";
import UploadPhoto from "components/Cards/UploadPhoto";
import Button from "components/Button";
import CardAttachment from "components/Cards/CardAttachment";
import PopupConfirm from "components/Popups/PopupConfirm";
import Loader from "components/Loader";
import ImagesGallery from "components/ImagesGallery";
import PopupNotification from "components/Popups/PopupNotification";
import InputField from "components/Form/InputField";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { userPublicPhotosByAlbum } from "store/user/public-photos-by-album";
import { userPublicAlbums } from "store/user/public-albums";
import { photos } from "store/photos";
import { prepareFormData } from "utils/preps";
import cn from "classnames";
import styles from "./index.module.scss";
import MasonryComponent from "../../../MasonryComponent";

function HandleAlbumEdit() {
  const { control, handleSubmit, reset } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });
  
  const router = useRouter();
  const dispatch = useDispatch();
  
  const queryAlbumId = router.query.albumId;
  const photosByAlbum = useSelector(userPublicPhotosByAlbum.selectors.photos);
  const addPhotoStatus = useSelector(userPublicPhotosByAlbum.selectors.addPhotoStatus);
  const photosByAlbumStatus = useSelector(userPublicPhotosByAlbum.selectors.status);
  const currentAlbumInfo = useSelector(userPublicAlbums.selectors.currentAlbum);
  const currentAlbumInfoStatus = useSelector(userPublicAlbums.selectors.currentAlbumStatus);
  const deletePhotoStatus = useSelector(userPublicPhotosByAlbum.selectors.deletePhotoStatus);
  const [photoId, setPhotoId] = useState(null);
  const [popupConfirmIsVisible, setPopupConfirmIsVisible] = useState(false);
  const [popupNotificationIsVisible, setPopupNotificationIsVisible] = useState(false);
  const [galleryIsVisible, setGalleryIsVisible] = useState(false);
  const [startIndexGallery, setStartIndexGallery] = useState(0);
  const limitPhoto = 9;
  
  useEffect(() => {
    const getData = async () => {
      await dispatch(userPublicAlbums.thunks.getPublicAlbumInfo(queryAlbumId));
    };
    if (queryAlbumId) {
      getData();
    }
    
    return () => dispatch(userPublicPhotosByAlbum.actions.SET_STATUS_REQUEST('idle'));
  }, [queryAlbumId]);
  
  useEffect(() => {
    const getPhotos = async () => {
      await dispatch(userPublicPhotosByAlbum.thunks.getPhotosByAlbum(queryAlbumId))
    }
    
    if (queryAlbumId) {
      getPhotos()
    }
    
    return () => dispatch(userPublicPhotosByAlbum.actions.RESET_STATE())
  }, [queryAlbumId])
  
  useEffect(() => {
    const { name, type } = currentAlbumInfo;
    reset({ ...defaultValues, name, type });
  }, [currentAlbumInfo]);
  
  useEffect(() => {
    if (deletePhotoStatus === 'success') {
      dispatch(userPublicPhotosByAlbum.actions.DELETE_PHOTO(photoId))
    }
  }, [deletePhotoStatus]);
  
  useEffect(() => {
    if (addPhotoStatus === 'fail') {
      setTimeout(() => {
        dispatch(userPublicPhotosByAlbum.actions.POP_PHOTOS())
      }, 5000);
    }
  }, [addPhotoStatus])
  
  const closePopup = () => {
    setPhotoId(null);
    setPopupConfirmIsVisible(false);
  };
  
  const addPhoto = async (photo) => {
    if (photosByAlbum.length < limitPhoto) {
      const file = prepareFormData({ photo });
      await dispatch(userPublicPhotosByAlbum.thunks.addPhoto({ img: file, albumId: queryAlbumId }));
    } else {
      setPopupNotificationIsVisible(true);
    }
  }
  
  const submitDeletePhoto = async () => {
    await dispatch(userPublicPhotosByAlbum.thunks.deletePhoto(photoId));
    setPopupConfirmIsVisible(false);
  };
  
  const onSubmit = async data => {
    await dispatch(userPublicPhotosByAlbum.thunks.editAlbum({
      albumId: queryAlbumId,
      data: {
        name: data.name,
        type: data.type
      }
    }));
    router.back();
  };
  
  return (
    <div className="pt-4">
      {currentAlbumInfoStatus === 'success' && (
        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={styles.upload}>
            <UploadPhoto
              name="photo"
              control={control}
              onChange={addPhoto}
              photosAmount={photosByAlbum.length}
            />
            <div className="text-center mt-1">
              Photo limit - {limitPhoto} photos
            </div>
          </div>
          <div className={styles.field}>
            <InputField
              name="name"
              control={control}
              placeholder="Name of the album"
            />
            {!photosByAlbum.length && (
              <div className={cn(
                styles.button,
                'd-flex justify-content-end mt-2'
              )}>
                <Button type="submit">
                  Save
                </Button>
              </div>
            )}
          </div>
        </form>
      )}
      
      {photosByAlbumStatus === 'success' ? (
        <>
          <MasonryComponent>
            {photosByAlbum.map((photo, key) => (
              <CardAttachment
                key={photo._id}
                attachment={photo}
                btnDelete
                onDelete={photoId => {
                  setPhotoId(photoId);
                  setPopupConfirmIsVisible(true);
                }}
                onClick={() => {
                  setStartIndexGallery(key);
                  setGalleryIsVisible(true);
                }}
                className="mb-3"
              />
            ))}
          </MasonryComponent>
          
          {photosByAlbum.length > 0 && (
            <div className={cn(
              styles.button,
              'd-flex justify-content-end mb-5'
            )}>
              <Button onClick={handleSubmit(onSubmit)}>
                Save
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="mb-5">
          <Loader />
        </div>
      )}
      
      {galleryIsVisible && (
        <ImagesGallery
          images={photosByAlbum}
          startIndex={startIndexGallery}
          onClose={() => {
            setGalleryIsVisible(false);
            dispatch(photos.actions.RESET_STATE());
          }}
        />
      )}
      
      {popupConfirmIsVisible && (
        <PopupConfirm
          dark
          onClose={closePopup}
          onConfirm={submitDeletePhoto}
          onCancel={closePopup}
          loader={deletePhotoStatus === 'pending'}
        >
          Are you sure you want to delete that photo from {currentAlbumInfo.name}?
        </PopupConfirm>
      )}
      {popupNotificationIsVisible && (
        <PopupNotification
          dark
          onClose={() => setPopupNotificationIsVisible(false)}
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
    </div>
  );
}

export default HandleAlbumEdit;