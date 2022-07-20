import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AccountPhotosLayout from "layouts/AccountPhotos";
import ButtonInline from "components/ButtonInline";
import CardAlbum from "components/Cards/CardAlbum";
import ListEmpty from "components/ListEmpty";
import Pagination from "components/Pagination";
import MainLayout from "layouts/Main";
import PopupConfirm from "components/Popups/PopupConfirm";
import PopupSelectAlbumsToShare from "components/AccountPage/PopupSelectAlbumsToShare";
import PopupSelectUsersToShare from "components/AccountPage/PopupSelectUsersToShare";
import PopupAlbumSharedToUsers from "components/AccountPage/PopupAlbumSharedToUsers";
import { userPrivateAlbums } from "store/user/private-albums";
import { userProfile } from "store/user/profile";
import { shareAlbums } from "store/users/share";
import { useRouter } from "next/router";
import IconAddSolid from "@/img/buttons/icon-add-solid.svg";
import IconShareSolid from "@/img/buttons/icon-share-solid.svg";
import styles from "./index.module.scss";

PrivateAlbumsPage.layouts = [MainLayout, AccountPhotosLayout]

function PrivateAlbumsPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const albums = useSelector(userPrivateAlbums.selectors.albums);
  const profile = useSelector(userProfile.selectors.profile);
  const profileStatus = useSelector(userProfile.selectors.profileStatus);
  const pagination = useSelector(userPrivateAlbums.selectors.pagination);
  const albumsCount = useSelector(userPrivateAlbums.selectors.albumsCount);
  const [currentPage, setCurrentPage] = useState(1);
  const [popupConfirmIsVisible, setPopupConfirmIsVisible] = useState(false);
  const [album, setAlbum] = useState(null);
  const [popupSelectAlbums, setPopupSelectAlbums] = useState(false);
  const [popupSelectUsers, setPopupSelectUsers] = useState(false);
  const [popupAlbumSharedUsers, setPopupAlbumSharedUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const isOwner = true;

  useEffect(() => {
    const getAlbums = async () => {
      await dispatch(userPrivateAlbums.thunks.getPrivateAlbums({userId: profile.user, isOwner}))
    }

    if(profileStatus === 'success') {
      getAlbums();
    }

    return () => dispatch(userPrivateAlbums.actions.RESET_STATE())
  }, [profileStatus]);

  const handlePage = async page => {
    setCurrentPage(page);
    await dispatch(userPrivateAlbums.actions.CHANGE_PAGE(page))
    dispatch(userPrivateAlbums.thunks.getPrivateAlbums({userId: profile.user, isOwner}))
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
  };

  const handleConfirmUserToShare = useCallback(user => {
    setSelectedUser(user);
    setPopupSelectUsers(false);
    setPopupSelectAlbums(true);
  }, []);

  const handleSubmitShareAlbums = useCallback(selectedAlbums => {
    const albumsIds = selectedAlbums.map(({_id}) => _id);

    dispatch(shareAlbums.thunks.shareAlbumsThunk({
      albumsIds,
      userId: selectedUser._id
    }));
    setPopupSelectAlbums(false);
  }, [selectedUser]);

  const handleCloseSelectUsersPopup = useCallback(() => {
    setPopupSelectUsers(false);
    setSelectedUser({});
  }, []);

  const handleDeleteUser = useCallback(() => setSelectedUser({}), []);

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <div className="text-xl text-bold">
          My private albums
        </div>
        <div className="d-flex">
          <ButtonInline
            iconPrepend={
              <img src={IconAddSolid.src} alt=""/>
            }
            onClick={() => router.push('/account/photos/private-albums/create')}
          >
            Add album
          </ButtonInline>
          <ButtonInline
            iconPrepend={
              <img src={IconShareSolid.src} alt=""/>
            }
            onClick={() => setPopupSelectUsers(true)}
            className="ml-2"
          >
            Share albums
          </ButtonInline>
        </div>
      </div>
      <div className={styles.list}>
        {albums.map(album => (
          <CardAlbum
            key={album._id}
            album={album}
            editAlbum
            onEdit={() => router.push({
              pathname: '/account/photos/private-albums/edit/[albumId]',
              query: { albumId: album._id },
            })}
            onDelete={album => {
              setAlbum(album);
              setPopupConfirmIsVisible(true);
            }}
            onShareUsers={() => {
              setAlbum(album);
              setPopupAlbumSharedUsers(true);
            }}
          />
        ))}
        {!albums.length && (
          <ListEmpty text="No results"/>
        )}
      </div>
      {albums.length > 0 && (
        <div className="d-flex justify-content-center mb-5">
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
        >
          Are you sure you want to delete {album.name} of the album from your Private albums?
        </PopupConfirm>
      )}

      {popupSelectUsers && (
        <PopupSelectUsersToShare
            onConfirm={handleConfirmUserToShare}
            onDelete={handleDeleteUser}
            onClose={handleCloseSelectUsersPopup}
            setPopup={setPopupSelectUsers}
        />
      )}

      {popupSelectAlbums && (
          <PopupSelectAlbumsToShare
              selectedUser={selectedUser}
              userId={profile.user}
              onConfirm={handleSubmitShareAlbums}
              setPopup={setPopupSelectAlbums}
          />
      )}

      {popupAlbumSharedUsers && (
          <PopupAlbumSharedToUsers
              albumId={album._id}
              onClose={() => setPopupAlbumSharedUsers(false)}
          />
      )}
    </>
  );
}

export default PrivateAlbumsPage;
