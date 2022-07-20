import Router from "next/router";
import CardAlbum from "components/Cards/CardAlbum";
import Pagination from "components/Pagination";
import PopupConfirm from "components/Popups/PopupConfirm";
import {useEffect, useState} from "react";
import { userPublicAlbums } from "store/user/public-albums";
import { useDispatch, useSelector } from "react-redux";
import Loader from "components/Loader";
import styles from "./index.module.scss";
import AddAlbumCard from "components/Cards/AddAlbumCard";
import Button from "components/Button";

function MyPublicAlbums(
  {
    profile,
    selectedCardId,
    setSelectedCardId,
    setIsActionButtonsVisible,
    popupConfirmIsVisible,
    setPopupConfirmIsVisible
  }) {
  const dispatch = useDispatch();

  const albums = useSelector(userPublicAlbums.selectors.albums);
  const albumsStatus = useSelector(userPublicAlbums.selectors.getAlbumsStatus);
  const albumsCount = useSelector(userPublicAlbums.selectors.albumsCount);
  const pagination = useSelector(userPublicAlbums.selectors.pagination)
  const deleteAlbumStatus = useSelector(userPublicAlbums.selectors.deleteAlbumStatus);
  const [currentPage, setCurrentPage] = useState(1);
  const [album, setAlbum] = useState(null);

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
    dispatch(userPublicAlbums.thunks.getPublicAlbums({userId: profile.user}));
    setSelectedCardId(null);
    setIsActionButtonsVisible(false);
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
    setSelectedCardId(null);
    setIsActionButtonsVisible(false);
  };

  const setSelectedCard = (albumId) => {
    if(albumId === selectedCardId) {
      setSelectedCardId(null);
      setIsActionButtonsVisible(false);
    } else {
      setSelectedCardId(albumId);
      setIsActionButtonsVisible(true);
    }
  }
  
  if (albumsStatus === 'pending') return <Loader/>

  return (
    <>
      {albums.length ? (
        <div className={styles.list}>
          <AddAlbumCard
            onClick={() => Router.push('/account/photos/public-albums/create')}
          />
          {albums.map(album => (
            <CardAlbum
              key={album._id}
              selected={selectedCardId === album._id}
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
              onClick={() => {
                setSelectedCard(album._id);
                setAlbum(album)
              }}
            />
          ))}
        </div>
      ) : (
        <div className="d-flex flex-column align-items-center">
          <div className="text-bitter title-xs color-grey-600 text-center mb-4">You don't have any public albums</div>
          <Button
          text="Add new album"
          textSize="xl"
          size="lg"
          onClick={() => Router.push('/account/photos/public-albums/create')}
          dark
          />
        </div>
      )}

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
          Are you sure you want to delete {album.name} of the album from your Public albums?
        </PopupConfirm>
      )}
    </>
  );
}

export default MyPublicAlbums;
