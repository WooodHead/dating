import AccountPhotosLayout from "layouts/AccountPhotos";
import Router from "next/router";
import MainLayout from 'layouts/Main';
import { useSelector } from "react-redux";
import MyPrivateAlbums from "components/AccountPage/MyPhotos/PrivateAlbums";
import Button from "components/Button";
import IconDelete from "components/icons/IconDelete";
import IconEdit from "components/icons/IconEdit";
import { userProfile } from "store/user/profile";
import { useState } from "react";
import cn from "classnames";
import styles from './index.module.scss'
import { windowActions } from "store/windowActions";
import { mediaSizes } from "utils/constants";
import PopupSelectAlbumsToShare from "components/AccountPage/PopupSelectAlbumsToShare";
import PopupSelectUsersToShare from "components/AccountPage/PopupSelectUsersToShare";
import { userPrivateAlbums } from "store/user/private-albums";

PrivateAlbumsPage.layouts = [MainLayout, AccountPhotosLayout];

function PrivateAlbumsPage() {

  const profile = useSelector(userProfile.selectors.profile);
  const profileStatus = useSelector(userProfile.selectors.profileStatus);
  const albums = useSelector(userPrivateAlbums.selectors.albums);
  const { width: windowWidth } = useSelector(windowActions.selectors.windowSize);

  const [isActionButtonsVisible, setIsActionButtonsVisible] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null)
  const [popupConfirmIsVisible, setPopupConfirmIsVisible] = useState(false);
  const [popupSelectAlbums, setPopupSelectAlbums] = useState(false);
  const [popupSelectUsers, setPopupSelectUsers] = useState(false);

  return (
    <>
      <div className={cn(
        styles.wrap
      )}>
        <div className={cn(
          styles.title,
          'title-xs text-semibold color-blue-900'
        )}>
          Private albums
        </div>
        {!!albums.length && (
          <div className={styles.share}>
            <Button
              outline
              size={windowWidth <= mediaSizes.sm && "sm"}
              textSize="md"
              onClick={() => setPopupSelectAlbums(true)}
              text={
                <span className="d-flex align-items-center">
                <img
                  src="/img/buttons/icon-share-solid.svg"
                  alt=""
                  className="mr-1"
                />
                <span>Share</span>
            </span>
              }
            />
          </div>
          )}
        {isActionButtonsVisible &&  (
          <div className={cn(
            styles.actions,
            'd-flex justify-content-end'
          )}>
            <Button
              outline
              size={windowWidth <= mediaSizes.sm && "sm"}
              textSize="md"
              onClick={() => Router.push({
                pathname: '/account/photos/private-albums/edit/[albumId]',
                query: { albumId: selectedCardId },
              })}
              text={
                <span className="d-flex align-items-center">
                  <IconEdit color="#355C7D"/>
                  <span>Edit</span>
              </span>
              }
            />
            <div className="ml-2">
              <Button
                outline
                size={windowWidth <= mediaSizes.sm && "sm"}
                textSize="md"
                onClick={() => setPopupConfirmIsVisible(true)}
                text={
                  <span className="d-flex align-items-center">
                  <IconDelete color="#355C7D"/>
                  <span>Delete</span>
              </span>
                }

              />
            </div>
          </div>
        )}
      </div>
      {profileStatus === 'success' && (
        <MyPrivateAlbums
          profile={profile}
          selectedCardId={selectedCardId}
          setSelectedCardId={setSelectedCardId}
          setIsActionButtonsVisible={setIsActionButtonsVisible}
          popupConfirmIsVisible={popupConfirmIsVisible}
          setPopupConfirmIsVisible={setPopupConfirmIsVisible}
        />
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
