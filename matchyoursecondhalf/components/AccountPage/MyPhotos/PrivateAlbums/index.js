import { useEffect, useState } from "react";
import CardAlbum from "components/Cards/CardAlbum";
import Pagination from "components/Pagination";
import PopupConfirm from "components/Popups/PopupConfirm";
import Router from "next/router";
import styles from "./index.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { userPrivateAlbums } from "store/user/private-albums";
import Loader from "components/Loader";
import AddAlbumCard from "components/Cards/AddAlbumCard";
import Button from "components/Button";


function MyPrivateAlbums(
  {
    profile,
    selectedCardId,
    setSelectedCardId,
    setIsActionButtonsVisible,
    popupConfirmIsVisible,
    setPopupConfirmIsVisible
  }
) {
  const dispatch = useDispatch();

  const albums = useSelector(userPrivateAlbums.selectors.albums);
  const albumsStatus = useSelector(userPrivateAlbums.selectors.getAlbumsStatus);
  const pagination = useSelector(userPrivateAlbums.selectors.pagination);
  const deleteAlbumStatus = useSelector(userPrivateAlbums.selectors.deleteAlbumStatus);
  const albumsCount = useSelector(userPrivateAlbums.selectors.albumsCount);
  const [currentPage, setCurrentPage] = useState(1);
  const [album, setAlbum] = useState(null);

  const isOwner = true;

  useEffect(() => {
    const getAlbums = async () => {
      await dispatch(userPrivateAlbums.thunks.getPrivateAlbums({userId: profile.user, isOwner}))
    }

    getAlbums();

    return () => dispatch(userPrivateAlbums.actions.RESET_STATE())
  }, [])

  const handlePage = async page => {
    setCurrentPage(page);
    await dispatch(userPrivateAlbums.actions.CHANGE_PAGE(page))
    dispatch(userPrivateAlbums.thunks.getPrivateAlbums({userId: profile.user, isOwner}))
    setSelectedCardId(null);
    setIsActionButtonsVisible(false);
  };

  const closePopup = () => {
    setAlbum(null);
    setPopupConfirmIsVisible(false);
  };

  const submitDeletePhoto = async () => {
    const res = await dispatch(userPrivateAlbums.thunks.deletePrivateAlbum({
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
            onClick={() => Router.push('/account/photos/private-albums/create')}
          />
          {albums.map(album => (
            <CardAlbum
              key={album._id}
              selected={selectedCardId === album._id}
              album={album}
              editAlbum
              onEdit={() => Router.push({
                pathname: '/account/photos/private-albums/edit/[albumId]',
                query: { albumId: album.id },
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
          <div className="text-bitter title-xs color-grey-600 text-center mb-4">You don't have any private albums</div>
          <Button
            text="Add new album"
            textSize="xl"
            size="lg"
            onClick={() => Router.push('/account/photos/private-albums/create')}
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
          Are you sure you want to delete {album.name} of the album from your Private albums?
        </PopupConfirm>
      )}
    </>
  );
}

export default MyPrivateAlbums;
