import AccountPhotosLayout from "layouts/AccountPhotos";
import Router from "next/router";
import MainLayout from 'layouts/Main';
import { useSelector } from "react-redux";
import MyPublicAlbums from "components/AccountPage/MyPhotos/PublicAlbums";
import Button from "components/Button";
import IconDelete from "components/icons/IconDelete";
import IconEdit from "components/icons/IconEdit";
import { userProfile } from "store/user/profile";
import { useState } from "react";
import cn from "classnames";
import styles from './index.module.scss'
import { windowActions } from "store/windowActions";
import { mediaSizes } from "utils/constants";

PublicAlbumsPage.layouts = [MainLayout, AccountPhotosLayout];

function PublicAlbumsPage() {

  const profile = useSelector(userProfile.selectors.profile);
  const profileStatus = useSelector(userProfile.selectors.profileStatus);
  const { width: windowWidth } = useSelector(windowActions.selectors.windowSize);

  const [isActionButtonsVisible, setIsActionButtonsVisible] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null)
  const [popupConfirmIsVisible, setPopupConfirmIsVisible] = useState(false);

  return (
    <>
      <div className={cn(
        styles.wrap,
        'd-flex justify-content-between mb-3'
      )}>
        <div className="title-xs text-semibold mb-5 mb-sm-0 color-blue-900">
          Public albums
        </div>
        {isActionButtonsVisible &&  (
          <div className="d-flex">
            <Button
              outline
              size={windowWidth <= mediaSizes.sm && "sm"}
              textSize="md"
              onClick={() => Router.push({
                pathname: '/account/photos/public-albums/edit/[albumId]',
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
        <MyPublicAlbums
          profile={profile}
          selectedCardId={selectedCardId}
          setSelectedCardId={setSelectedCardId}
          setIsActionButtonsVisible={setIsActionButtonsVisible}
          popupConfirmIsVisible={popupConfirmIsVisible}
          setPopupConfirmIsVisible={setPopupConfirmIsVisible}
        />
      )}
    </>
  );
}

export default PublicAlbumsPage;
