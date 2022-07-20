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
  const albums = useSelector(userPublicAlbums.selectors.albums);
  const albumsStatus = useSelector(userPublicAlbums.selectors.getAlbumsStatus);
  const albumsCount = useSelector(userPublicAlbums.selectors.albumsCount);
  const pagination = useSelector(userPublicAlbums.selectors.pagination)
  const deleteAlbumStatus = useSelector(userPublicAlbums.selectors.deleteAlbumStatus);
  const [currentPage, setCurrentPage] = useState(1);
  const [album, setAlbum] = useState(null);
  const [popupConfirmIsVisible, setPopupConfirmIsVisible] = useState(false);
  
  useEffect(() => {
    const getAlbums = async () => {
      await dispatch(userPublicAlbums.thunks.getPublicAlbums({ userId: profile.user }));
    }
    
    getAlbums();
    
    return () => dispatch(userPublicAlbums.actions.RESET_STATE());
  }, []);
  
  const handlePage = async page => {
    setCurrentPage(page);
    await dispatch(userPublicAlbums.actions.CHANGE_PAGE(page));
    dispatch(userPublicAlbums.thunks.getPublicAlbums({ userId: profile.user }));
  };
  
  const closePopup = () => {
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
  
  if (albumsStatus === 'pending') return <Loader />
  
  return (
    <>
      <div className={styles.list}>
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
        {albumsStatus === 'success' && !albums.length && (
          <ListEmpty text="No results" />
        )}
      </div>
      
      {albums.length > 0 && (
        <div className="d-flex justify-content-end mb-5">
          <Pagination
            current={currentPage}
            total={albumsCount}
            pageSize={pagination.take}
            onChange={handlePage}
          />
        </div>
      )}
      
      {popupConfirmIsVisible && (
        <PopupConfirm
          onClose={closePopup}
          onConfirm={submitDeletePhoto}
          onCancel={closePopup}
          loader={deleteAlbumStatus === 'pending'}
        >
          <div className="text-center">
            Are you sure you want to delete {album.name} of the album from your Public albums?
          </div>
        </PopupConfirm>
      )}
    </>
  );
}

export default MyPublicAlbums;
