import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { defaultValues, schema } from "./config";
import UploadPhoto from "components/Cards/UploadPhoto";
import TextField from "components/Form/TextField";
import Button from "components/Button";
import CardAttachment from "components/Cards/CardAttachment";
import PopupConfirm from "components/Popups/PopupConfirm";
import styles from "./index.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { prepareFormData } from "utils/preps";
import { useRouter } from "next/router";
import { userPublicPhotosByAlbum } from "store/user/public-photos-by-album";
import { userPublicAlbums } from "store/user/public-albums";
import PopupNotification from "components/Popups/PopupNotification";
import ImagesGallery from "components/ImagesGallery";
import { yupResolver } from "@hookform/resolvers/yup";
import cn from "classnames";

function HandleAlbumCreate() {
  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });

  const dispatch = useDispatch();
  const router = useRouter();

  const typeOfAlbum = router.pathname.includes('private') ? 'Private' : 'Public';

  const list = useSelector(userPublicPhotosByAlbum.selectors.photos);
  const addPhotoStatus = useSelector(userPublicPhotosByAlbum.selectors.addPhotoStatus);

  const limitPhoto = 9;

  const [title, setTitle] = useState(`Add ${typeOfAlbum.toLowerCase()} album`);
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
    if(addPhotoStatus === 'fail') {
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
    setTitle(`Add photo to ${typeOfAlbum.toLowerCase()} album`)
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
    if(list.length < limitPhoto) {
      const file = prepareFormData({photo: data, albumId});
      await dispatch(userPublicPhotosByAlbum.thunks.addPhoto({albumId, img: file}))
    } else {
      setPopupNotificationIsVisible(true);
    }
  }

  const AlbumCreate = () => {
    return (
      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={cn(
          styles.fields,
          styles['text-field']
        )}>
          <TextField
            label="Name of the album"
            name="name"
            control={control}
            placeholder="Enter name"
          />
          <div className={cn(
            styles.button,
            'd-flex justify-content-start mt-2'
          )}>
            <Button
              type="submit"
              text="Save"
              textSize="xl"
              dark
            />
          </div>
        </div>
      </form>
    )
  }

  const AddPhotos = () => {
    return (
      <>
        <div className={styles['upload-block']}>
          <div className={styles.list}>
            <div className={styles.upload}>
              <UploadPhoto
                name="photo"
                control={control}
                onChange={addPhoto}
                photosAmount={list.length}
              />
              <div className="text-xs text-center color-grey-600 mt-1">
                Limit {limitPhoto} photos in album
              </div>
            </div>
              {list.map((album, idx) => (
                <CardAttachment
                  key={album._id}
                  attachment={album}
                  btnDelete
                  publicView={false}
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
          <Button
            text="Save"
            textSize="xl"
            dark
            onClick={() => router.back()}
          />
        </div>
        {galleryIsVisible && (
          <ImagesGallery
            images={list}
            startIndex={startIndexGallery}
            onClose={() => setGalleryIsVisible(false)}
          />
        )}
    </>
    )
  }

  return (
    <div>
      <div className="title-xs text-semibold mb-5 color-blue-900">
        {title}
      </div>
      {!isAlbumCreated && <AlbumCreate />}
      {isAlbumCreated && <AddPhotos />}

      {popupConfirmIsVisible && (
        <PopupConfirm
          onClose={closePopup}
          onConfirm={deletePhoto}
          onCancel={closePopup}
        >
          Are you sure you want to delete Name of the album from your {typeOfAlbum.toLowerCase()} albums?
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
