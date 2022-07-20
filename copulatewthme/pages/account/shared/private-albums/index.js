import {useCallback, useEffect, useRef} from "react";
import { userShareAlbums } from "store/user/share-albums";
import { useDispatch, useSelector } from "react-redux";
import { throttle } from "utils/throttle";
import { userProfile } from "store/user/profile";
import { publicProfile } from "store/profile/public-profile";
import Router from "next/router";
import AccountPhotosLayout from "layouts/AccountPhotos";
import ListEmpty from "components/ListEmpty";
import MainLayout from 'layouts/Main';
import UserItem from "../UserItem";
import cn from "classnames";
import styles from "./index.module.scss";

SharedPrivateAlbumsPage.layouts = [MainLayout, AccountPhotosLayout]

function SharedPrivateAlbumsPage() {
  const dispatch = useDispatch();
  const containerRef = useRef();
  const usersList = useSelector(userShareAlbums.selectors.usersSharedAlbums);
  const { isPremiumUser } = useSelector(userProfile.selectors.profile);

  useEffect( () => {
    const getUsers = async () => await dispatch(userShareAlbums.thunks.getUsersSharedAlbums());

    getUsers();
  }, [])

  const handleUserClick = useCallback((userId) => {

    if (!isPremiumUser) {
      dispatch(userProfile.actions.TOGGLE_POPUP(true));
      return
    }

    dispatch(publicProfile.actions.SET_MAIN_TAB('photos'));
    dispatch(publicProfile.actions.SET_SUB_TAB('privateAlbums'));
    Router.push({
        pathname: '/profile/[userId]',
        query: { userId },
      });

  }, [isPremiumUser]);

  const handleDeleteUser = useCallback((e) => {
    e.stopPropagation();
    console.log('delete')
  }, [])

  function handleContainerScroll() {
    if (!containerRef.current) return;
  }

  return (
    <>
      <div className="mb-4">
        <div
          className={cn([styles.wrap, 'custom-scroll dark mb-2'])}
          ref={containerRef}
          onScroll={throttle(handleContainerScroll, 500)}
        >
          {usersList.map(user => (
            <UserItem
            key={user._id}
            onClick={handleUserClick}
            onDelete={handleDeleteUser}
            {...user} />
          ))}
          {!usersList.length && (
            <ListEmpty text="No results"/>
          )}
        </div>
      </div>
    </>
  );
}

export default SharedPrivateAlbumsPage;
