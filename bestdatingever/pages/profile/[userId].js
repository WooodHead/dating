import { useEffect, useState } from "react";
import MainLayout from "layouts/Main";
import PublicTabs from "components/ProfilePage/PublicTabs";
import PublicProfile from "components/ProfilePage/PublicProfile";
import PopupNotification from "components/Popups/PopupNotification";
import Page404 from "components/ErrorsPages/Page404";
import PublicMainPhotos from "components/ProfilePage/PublicMainPhotos";
import PublicAlbums from "components/ProfilePage/PublicAlbums";
import PublicPrivateAlbums from "components/ProfilePage/PublicPrivateAlbums";
import BreadCrumbs from "components/BreadCrumbs";
import Loader from "components/Loader";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { publicProfile } from "store/profile/public-profile";
import { publicPhotos } from "store/profile/public-photos";
import { publicAlbums } from "store/profile/public-albums";
import { userProfile } from "store/user/profile";

ProfilePage.layouts = [MainLayout];
ProfilePage.accessMode = 'private';

const tabs = [
  { slug: 'profile', text: 'Profile' },
  { slug: 'main', text: 'Main Photos' },
  { slug: 'public', text: 'Public albums' },
  { slug: 'private', text: 'Private albums' },
];

function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const profile = useSelector(publicProfile.selectors.profile);
  const myProfile = useSelector(userProfile.selectors.profile);
  const [tabActive, setTabActive] = useState(tabs[0].slug);
  const profileStatus = useSelector(publicProfile.selectors.status);
  const profileStatusCode = useSelector(publicProfile.selectors.statusCode);
  const userId = router.query.userId;
  const [breadCrumbs, setBreadCrumbs] = useState({
    profile: { _id: 1, text: '' }
  });

  const handleOnTabClick = (slug) => {
    const isAccessibleAlbums = !myProfile.isPremiumUser && slug === 'public' ||
        !myProfile.isPremiumUser && slug === 'private';
    if (isAccessibleAlbums) {
      dispatch(userProfile.actions.TOGGLE_POPUP(true));
      return;
    }
    setTabActive(slug);
  }
  
  useEffect(() => {
    if (userId && !Object.keys(profile).length) {
      dispatch(publicProfile.thunks.getPublicProfile(userId));
    }
  }, [userId]);
  
  useEffect(() => {
    return () => {
      dispatch(publicProfile.actions.RESET_STATE())
      dispatch(publicPhotos.actions.RESET_STATE())
      dispatch(publicAlbums.actions.RESET_STATE())
    };
  }, []);
  
  useEffect(() => {
    if (profileStatus === 'success') {
      setBreadCrumbs(prevState => ({
        ...prevState,
        profile: {
          ...prevState.profile,
          text: profile.name + '\'s Profile'
        }
      }));
    }
  }, [profileStatus]);
  
  if (['idle', 'pending'].includes(profileStatus)) {
    return <Loader/>;
  }
  
  if (profileStatus === 'fail' && profileStatusCode === 406) {
    return <Page404 />;
  }
  
  if (profile.blockedFrom) {
    return (
      <PopupNotification onClose={() => router.push('/')}>
        You can’t view this profile since you were blocked by this user.
      </PopupNotification>
    );
  }
  
  return (
    <div>
      <BreadCrumbs list={breadCrumbs}/>
      <PublicTabs
        tabs={tabs}
        tabActive={tabActive}
        onClick={handleOnTabClick}
      />
      {tabActive === 'profile' && <PublicProfile />}
      {tabActive === 'main' && <PublicMainPhotos />}
      {tabActive === 'public' && <PublicAlbums />}
      {tabActive === 'private' && <PublicPrivateAlbums />}
    </div>
  );
}

export default ProfilePage;
