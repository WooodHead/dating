import { useEffect, useState } from "react";
import MainLayout from "layouts/Main";
import LinkBack from "components/LinkBack";
import PublicTabs from "components/ProfilePage/PublicTabs";
import PublicProfile from "components/ProfilePage/PublicProfile";
import PublicPhoto from "components/ProfilePage/PublicPhotos";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { publicProfile } from "store/profile/public-profile";
import { publicPhotos } from "store/profile/public-photos";
import { publicAlbums } from "store/profile/public-albums";
import { privateAlbums } from "store/profile/private-albums";
import PopupNotification from "components/Popups/PopupNotification";
import Page404 from "components/ErrorsPages/Page404";

ProfilePage.layouts = [MainLayout];
ProfilePage.accessMode = 'private';

function ProfilePage() {
  const tabs = [
    { slug: 'profile', text: 'Profile', src: '/img/profile/icon-profile.svg' },
    { slug: 'photos', text: 'Photos', src: '/img/profile/icon-photos.svg' },
  ];
  const router = useRouter();
  const dispatch = useDispatch();
  const userProfile = useSelector(publicProfile.selectors.profile);
  const activeMainTab = useSelector(publicProfile.selectors.activeMainTab);
  const profileStatus = useSelector(publicProfile.selectors.status);
  const profileStatusCode = useSelector(publicProfile.selectors.statusCode);
  
  const onTab = tab => {
    dispatch(publicProfile.actions.SET_MAIN_TAB(tab.slug));
  };
  
  useEffect(() => {
    return () => {
      dispatch(publicProfile.actions.RESET_STATE())
      dispatch(publicPhotos.actions.RESET_STATE())
      dispatch(publicAlbums.actions.RESET_STATE())
      dispatch(privateAlbums.actions.RESET_STATE())
    };
  }, []);
  
  if (profileStatus === 'fail' && profileStatusCode === 406) {
    return <Page404/>;
  }
  
  if (userProfile.blockedFrom) {
    return (
      <PopupNotification onClose={() => router.push('/')}>
        You can’t view this profile since you were blocked by this user.
      </PopupNotification>
    );
  }
  
  return (
    <div>
      <div className="mb-4 mb-md-3">
        <LinkBack
          text="To search"
          onClick={() => router.push('/')}
        />
      </div>
      <PublicTabs
        tabs={tabs}
        tabActive={activeMainTab}
        onClick={onTab}
      />
      {activeMainTab === 'profile' && <PublicProfile/>}
      {activeMainTab === 'photos' && <PublicPhoto/>}
    </div>
  );
}

export default ProfilePage;
