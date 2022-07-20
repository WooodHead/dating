import { useState } from "react";
import ButtonInline from "components/ButtonInline";
import CardAlbum from "components/Cards/CardAlbum";
import ListEmpty from "components/ListEmpty";
import Pagination from "components/Pagination";
import PopupConfirm from "components/Popups/PopupConfirm";
import PopupSelectAlbumsToShare from "components/AccountPage/PopupSelectAlbumsToShare";
import PopupSelectUsersToShare from "components/AccountPage/PopupSelectUsersToShare";
import Router from "next/router";
import styles from "./index.module.scss";
import MainLayout from "layouts/Main";

PrivateAlbumsPage.layouts = [MainLayout]

function PrivateAlbumsPage() {
  const albums = [
    {
      id: 1,
      thumb: '',
      name: 'Polar night in the far north',
      amount: 12,
      permission: true
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);

  const handlePage = page => {
    setCurrentPage(page);
    // action
  };

  const [popupConfirmIsVisible, setPopupConfirmIsVisible] = useState(false);
  const [album, setAlbum] = useState(null);
  const [popupSelectAlbums, setPopupSelectAlbums] = useState(false);
  const [popupSelectUsers, setPopupSelectUsers] = useState(false);

  const closePopup = () => {
    setAlbum(null);
    setPopupConfirmIsVisible(false);
  };

  const submitDeletePhoto = () => {
    setPopupConfirmIsVisible(false);
    console.log('Deleted', album);
  };

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <div className="text-xl text-bold">
          My private albums
        </div>
        <div className="d-flex">
          <ButtonInline
            onClick={() => Router.push('/account/photos/private-albums/create')}
          >
            Add album
          </ButtonInline>
          <ButtonInline
            onClick={() => setPopupSelectAlbums(true)}
            className="ml-2"
          >
            Share albums
          </ButtonInline>
        </div>
      </div>
      <div className={styles.list}>
        {albums.map(album => (
          <CardAlbum
            key={album.id}
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
          />
        ))}
        {!albums.length && (
          <ListEmpty text="No results"/>
        )}
      </div>
      {albums.length > 0 && (
        <div className="d-flex justify-content-end mb-5">
          <Pagination
            current={currentPage}
            total={albums.length}
            pageSize={albums.length}
            onChange={handlePage}
          />
        </div>
      )}

      {popupConfirmIsVisible && (
        <PopupConfirm
          onClose={closePopup}
          onConfirm={submitDeletePhoto}
          onCancel={closePopup}
        >
          Are you sure you want to delete {album.name} of the album from your Private albums?
        </PopupConfirm>
      )}

      {popupSelectAlbums && (
        <PopupSelectAlbumsToShare
          onConfirm={() => {
            setPopupSelectAlbums(false)
            setPopupSelectUsers(true);
          }}
          onClose={() => setPopupSelectAlbums(false)}
        />
      )}

      {popupSelectUsers && (
        <PopupSelectUsersToShare
          onClose={() => setPopupSelectUsers(false)}
        />
      )}
    </>
  );
}

export default PrivateAlbumsPage;
