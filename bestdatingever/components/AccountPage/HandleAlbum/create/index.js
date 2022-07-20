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
import MasonryList from "components/MasonryComponent";
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
  const [isAlbumCreated, setIsAlbumCreated] = useState(false)
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
        <div className="mb-3 text-poppins text-medium text-xl text-uppercase">
          Add new album
        </div>
        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
        >
          <InputField
            name="name"
            control={control}
            placeholder="Name of the album"
          />
          <div className={cn(
            styles.button,
            'd-flex justify-content-end mt-2'
          )}>
            <Button
              type="submit"
              size="md"
            >
              Save
            </Button>
          </div>
        </form>
      </>
    )
  }
  
  const AddPhotos = () => {
    return (
      <>
        <div className="text-xl text-medium mb-3 text-poppins text-uppercase">
          {getValues('name')}
        </div>
        
        <MasonryList>
          <div>
            <UploadPhoto
              name="photo"
              control={control}
              onChange={addPhoto}
              photosAmount={list.length}
            />
            <div className="text-center mt-1">
              Photo limit - {limitPhoto} photos
            </div>
          </div>
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
              className="mb-3"
            />
          ))}
        </MasonryList>
        
        <div className="d-flex justify-content-end mb-5">
          <Button
            onClick={() => router.back()}
          >
            Save
          </Button>
        </div>
        
        {
          galleryIsVisible && (
            <ImagesGallery
              images={list}
              startIndex={startIndexGallery}
              onClose={() => {
                setGalleryIsVisible(false);
                dispatch(photos.actions.RESET_STATE());
              }}
            />
          )
        }
      </>
    )
  }
  
  return (
    <div className="pt-4">
      {!isAlbumCreated && <AlbumCreate />}
      {isAlbumCreated && <AddPhotos />}
      
      {popupConfirmIsVisible && (
        <PopupConfirm
          dark
          onClose={closePopup}
          onConfirm={deletePhoto}
          onCancel={closePopup}
          loader={deletePhotoStatus === 'pending'}
        >
          Are you sure you want to delete photo from the album?
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

export default HandleAlbumCreate;
