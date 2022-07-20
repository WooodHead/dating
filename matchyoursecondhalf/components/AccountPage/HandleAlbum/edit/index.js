import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { defaultValues, schema } from "./config";
import UploadPhoto from "components/Cards/UploadPhoto";
import TextField from "components/Form/TextField";
import Button from "components/Button";
import CardAttachment from "components/Cards/CardAttachment";
import PopupConfirm from "components/Popups/PopupConfirm";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { userPublicPhotosByAlbum } from "store/user/public-photos-by-album";
import { userPublicAlbums } from "store/user/public-albums";
import Loader from "components/Loader";
import ImagesGallery from "components/ImagesGallery";
import { prepareFormData } from "utils/preps";
import styles from "./index.module.scss";
import cn from "classnames";
import PopupNotification from "components/Popups/PopupNotification";
import { photos } from "store/photos";

function HandleAlbumEdit() {
  const { control, handleSubmit, reset } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });

  const router = useRouter();
  const dispatch = useDispatch();

  const typeOfAlbum = router.pathname.includes('private') ? 'private' : 'public';
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

    if(queryAlbumId) {
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
    if(addPhotoStatus === 'fail') {
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
    if(photosByAlbum.length < limitPhoto) {
      const file = prepareFormData({ photo });
      await dispatch(userPublicPhotosByAlbum.thunks.addPhoto({img: file, albumId: queryAlbumId }));
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
    <div>
      <div className="title-xs text-semibold mb-5 color-blue-900">
        Edit {typeOfAlbum} album
      </div>
      {currentAlbumInfoStatus === 'success' && (
        <>
          <div className={styles.form}>
            <div className={styles.upload}>
              <UploadPhoto
                name="photo"
                control={control}
                onChange={addPhoto}
                photosAmount={photosByAlbum.length}
              />
              <div className="text-xs text-center color-grey-600 mt-1">
                Limit 9 photos in album
              </div>
            </div>
            <div className={cn(
              styles.input,
              'ml-3'
            )}>
              <TextField
                label="Name of the album"
                name="name"
                control={control}
                placeholder="Enter name"
              />
            </div>
          </div>
        </>
      )}

      {photosByAlbumStatus === 'success' ? (
        <>
          <div className={styles.list}>
            {photosByAlbum.map((photo, key) => (
              <CardAttachment
                key={photo._id}
                attachment={photo}
                btnDelete
                publicView={false}
                onDelete={photoId => {
                  setPhotoId(photoId);
                  setPopupConfirmIsVisible(true);
                }}
                onClick={() => {
                  setStartIndexGallery(key);
                  setGalleryIsVisible(true);
                }}
              />
            ))}
          </div>
          {photosByAlbum.length > 0 && (
            <div className={cn(
              styles.button,
              'd-flex justify-content-end mb-5'
            )}>
              <Button
                text="Save"
                textSize="xl"
                dark
                onClick={handleSubmit(onSubmit)}
              />
            </div>
          )}
        </>
      ) : (
        <div className="mb-5">
          <Loader/>
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
          onClose={closePopup}
          onConfirm={submitDeletePhoto}
          onCancel={closePopup}
        >
          Are you sure you want to delete {currentAlbumInfo.name} of the album from your Public albums?
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

export default HandleAlbumEdit;