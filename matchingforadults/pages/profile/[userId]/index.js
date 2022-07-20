import { useEffect } from "react";
import MainLayout from "layouts/Main";
import LinkBack from "components/LinkBack";
import PublicProfile from "components/ProfilePage/PublicProfile";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { publicProfile } from "store/profile/public-profile";
import { publicPhotos } from "store/profile/public-photos";
import { publicAlbums } from "store/profile/public-albums";
import PopupNotification from "components/Popups/PopupNotification";
import Page404 from "components/ErrorsPages/Page404";

ProfilePage.layouts = [MainLayout];
ProfilePage.accessMode = 'private';

function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userProfile = useSelector(publicProfile.selectors.profile);
  const profileStatus = useSelector(publicProfile.selectors.status);
  const profileStatusCode = useSelector(publicProfile.selectors.statusCode);
  
  useEffect(() => {
    return () => {
      dispatch(publicProfile.actions.RESET_STATE())
      dispatch(publicPhotos.actions.RESET_STATE())
      dispatch(publicAlbums.actions.RESET_STATE())
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
          text="Back to home"
          onClick={() => router.push('/')}
        />
      </div>
      <PublicProfile/>
    </div>
  );
}

export default ProfilePage;
