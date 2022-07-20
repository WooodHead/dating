import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { defaultValues, schema } from "./config";
import UploadPhoto from "components/Cards/UploadPhoto";
import Button from "components/Button";
import CardAttachment from "components/Cards/CardAttachment";
import PopupConfirm from "components/Popups/PopupConfirm";
import PopupNotification from "components/Popups/PopupNotification";
import ImagesGallery from "components/ImagesGallery";
import InputField from "components/Form/InputField";
import { useDispatch, useSelector } from "react-redux";
import { prepareFormData } from "utils/preps";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { userPublicPhotosByAlbum } from "store/user/public-photos-by-album";
import { userPublicAlbums } from "store/user/public-albums";
import { photos } from "store/photos";
import cn from "classnames";
import styles from "./index.module.scss";

function HandleAlbumCreate() {
  const { control, handleSubmit, setValue, getValues } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });
  
  const dispatch = useDispatch();
  const router = useRouter();
  
  const typeOfAlbum = router.pathname.includes('private') ? 'Private' : 'Public';
  
  const list = useSelector(userPublicPhotosByAlbum.selectors.photos);
  const addPhotoStatus = useSelector(userPublicPhotosByAlbum.selectors.addPhotoStatus);
  const deletePhotoStatus = useSelector(userPublicPhotosByAlbum.selectors.deletePhotoStatus);
  
  const limitPhoto = 9;
  
  const [popupConfirmIsVisible, setPopupConfirmIsVisible] = useState(false);
  const [popupNotificationIsVisible, setPopupNotificationIsVisible] = useState(false);
  const [deletedPhotoId, setDeletedPhotoId] = useState(null)
  const [albumId, setAlbumId] = useState(null);
  const [isAlbumCreated, setIsAlbumCreated] = useState(false);
  const [startIndexGallery, setStartIndexGallery] = useState(0);
  const [galleryIsVisible, setGalleryIsVisible] = useState(false);
  
  useEffect(() => {
    return () => dispatch(userPublicPhotosByAlbum.actions.RESET_STATE())
  }, [])
  
  useEffect(() => {
    if (addPhotoStatus === 'fail') {
      setTimeout(() => {
        dispatch(userPublicPhotosByAlbum.actions.POP_PHOTOS())
      }, 5000);
    }
  }, [addPhotoStatus])
  
  useEffect(() => {
    setValue('type', typeOfAlbum);
  }, [])
  
  const onSubmit = async (data) => {
    const res = await dispatch(userPublicAlbums.thunks.createAlbum(data));
    setAlbumId(res.payload._id);
    setIsAlbumCreated(true);
  };
  
  const closePopup = () => {
    setPopupConfirmIsVisible(false);
    setDeletedPhotoId(null);
  };
  
  const deletePhoto = async () => {
    await dispatch(userPublicPhotosByAlbum.thunks.deletePhoto(deletedPhotoId));
    setPopupConfirmIsVisible(false);
    setDeletedPhotoId(null);
  };
  
  const submitDeletePhoto = (photoId) => {
    setDeletedPhotoId(photoId);
    setPopupConfirmIsVisible(true);
  }
  
  const addPhoto = async (data) => {
    if (list.length < limitPhoto) {
      const file = prepareFormData({ photo: data, albumId });
      await dispatch(userPublicPhotosByAlbum.thunks.addPhoto({ albumId, img: file }))
    } else {
      setPopupNotificationIsVisible(true);
    }
  }
  
  const AlbumCreate = () => {
    return (
      <>
        <div className="title-xs text-bold text-palatino mb-4">
          Add album
        </div>
        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className={cn(
            styles.fields,
            styles['text-field']
          )}>
            <InputField
              label="Name of the album"
              name="name"
              control={control}
              placeholder="Enter name"
            />
            <div className={cn(
              styles.button,
              'd-flex justify-content-start mt-2'
            )}>
              <Button type="submit" className="text-bold p-2">
                Save
              </Button>
            </div>
          </div>
        </form>
      </>
    )
  }
  
  const AddPhotos = () => {
    return (
      <>
        <div className={cn(styles.title, 'mb-3')}>
          <div className="title-xs text-bold text-palatino mr-2">
            {getValues('name')}
          </div>
          <div className={cn(styles.amount, 'text-md color-grey-600 text-italic')}>
            photo limit - {limitPhoto} photos
          </div>
        </div>
        
        <div className="text-md color-grey-600 text-italic mb-1">
          The last photo you upload will be the album cover
        </div>
        
        <div className={styles['upload-block']}>
          <div className={styles.list}>
            <UploadPhoto
              name="photo"
              control={control}
              onChange={addPhoto}
              photosAmount={list.length}
            />
            {list.map((album, idx) => (
              <CardAttachment
                key={album._id}
                attachment={album}
                btnDelete
                onDelete={(photoId) => submitDeletePhoto(photoId)}
                onClick={() => {
                  setGalleryIsVisible(true);
                  setStartIndexGallery(idx);
                }}
              />
            ))}
          </div>
        </div>
        
        <div className={cn(
          styles.button,
          'd-flex justify-content-end mb-5'
        )}>
          <Button onClick={() => router.back()} className="text-bold p-2">
            Save
          </Button>
        </div>
        {galleryIsVisible && (
          <ImagesGallery
            images={list}
            startIndex={startIndexGallery}
            onClose={() => {
              setGalleryIsVisible(false);
              dispatch(photos.actions.RESET_STATE());
            }}
          />
        )}
      </>
    )
  }
  
  return (
    <div>
      {!isAlbumCreated && <AlbumCreate />}
      {isAlbumCreated && <AddPhotos />}
      
      {popupConfirmIsVisible && (
        <PopupConfirm
          onClose={closePopup}
          onConfirm={deletePhoto}
          onCancel={closePopup}
          loader={deletePhotoStatus === 'pending'}
        >
          <div className="text-center">
            Are you sure you want to delete photo from the album?
          </div>
        </PopupConfirm>
      )}
      {popupNotificationIsVisible && (
        <PopupNotification
          textSize="md"
          onClose={() => setPopupNotificationIsVisible(false)}
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
    </div>
  );
}

export default HandleAlbumCreate;
