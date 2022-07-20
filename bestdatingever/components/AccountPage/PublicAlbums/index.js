import Router from "next/router";
import CardAlbum from "components/Cards/CardAlbum";
import ListEmpty from "components/ListEmpty";
import Pagination from "components/Pagination";
import PopupConfirm from "components/Popups/PopupConfirm";
import { useEffect, useState } from "react";
import { userPublicAlbums } from "store/user/public-albums";
import { useDispatch, useSelector } from "react-redux";
import Loader from "components/Loader";
import styles from "./index.module.scss";

function MyPublicAlbums({ profile }) {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(userPublicAlbums.thunks.getPublicAlbums({
      userId: profile.user,
      type: 'Public'
    }));
    
    return () => dispatch(userPublicAlbums.actions.RESET_STATE());
  }, []);
  
  const albums = useSelector(userPublicAlbums.selectors.albums);
  const albumsCount = useSelector(userPublicAlbums.selectors.albumsCount);
  const status = useSelector(userPublicAlbums.selectors.getAlbumsStatus);
  const deleteAlbumStatus = useSelector(userPublicAlbums.selectors.deleteAlbumStatus);
  const [currentPage, setCurrentPage] = useState(1);
  
  const handlePage = async page => {
    setCurrentPage(page);
    await dispatch(userPublicAlbums.actions.CHANGE_PAGE(page));
    dispatch(userPublicAlbums.thunks.getPublicAlbums({
      userId: profile.user,
      type: 'Public',
    }));
  };
  
  const [popupConfirmIsVisible, setPopupConfirmIsVisible] = useState(false);
  const [album, setAlbum] = useState(null);
  
  const closePopup = () => {
    setAlbum(null);
    setPopupConfirmIsVisible(false);
  };
  
  const submitDeletePhoto = async () => {
    const res = await dispatch(userPublicAlbums.thunks.deletePublicAlbum({
      albumId: album._id,
      userId: profile.user,
      page: currentPage,
    }));
    setCurrentPage(res.payload)
    setPopupConfirmIsVisible(false);
  };
  
  if (status === 'pending') return <Loader />
  
  return (
    <div className={styles.wrap}>
      <div className={styles['wrap__bg']} />
      <div className={styles.list}>
        <div
          className={styles['add-album']}
          onClick={() => Router.push('/account/photos/public-albums/create')}
        >
          <div className={styles['add-album__content']}>
            <img src="/img/cards/icon-plus.svg" alt="" className={styles['add-album__icon']}/>
            <div className={styles['add-album__text']}>Add album</div>
          </div>
        </div>
        
        {albums.map(album => (
          <CardAlbum
            key={album._id}
            album={album}
            editAlbum
            onEdit={() => Router.push({
              pathname: '/account/photos/public-albums/edit/[albumId]',
              query: { albumId: album._id },
            })}
            onDelete={album => {
              setAlbum(album);
              setPopupConfirmIsVisible(true);
            }}
          />
        ))}
        {!albums.length && (
          <ListEmpty text="No results" />
        )}
      </div>
      
      {albums.length > 0 && (
        <div className="d-flex justify-content-end mb-5">
          <Pagination
            current={currentPage}
            total={albumsCount}
            pageSize={5}
            onChange={handlePage}
          />
        </div>
      )}
      
      {popupConfirmIsVisible && (
        <PopupConfirm
          dark
          onClose={closePopup}
          onConfirm={submitDeletePhoto}
          onCancel={closePopup}
          loader={deleteAlbumStatus === 'pending'}
        >
          <div className="title-xs text-new-york text-medium mb-2">Caution</div>
          <div className="mb-4">
            Are you sure you want to delete {album.name} of the album from your Public albums?
          </div>
        </PopupConfirm>
      )}
    </div>
  );
}

export default MyPublicAlbums;
