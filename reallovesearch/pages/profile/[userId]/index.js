import { useEffect } from "react";
import MainLayout from "layouts/Main";
import LinkBack from "components/LinkBack";
import PublicProfile from "components/ProfilePage/PublicProfile";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { publicProfile } from "store/profile/public-profile";
import { publicPhotos } from "store/profile/public-photos";
import { publicAlbums } from "store/profile/public-albums";

ProfilePage.layouts = [MainLayout];
ProfilePage.accessMode = 'private';

function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  useEffect(() => {
    return () => {
      dispatch(publicProfile.actions.RESET_STATE());
      dispatch(publicPhotos.actions.RESET_STATE());
      dispatch(publicAlbums.actions.RESET_STATE());
    }
  }, []);

  return (
    <div>
      <div className="mb-4">
        <LinkBack
          text="Back to search"
          onClick={() => router.push('/')}
        />
      </div>
      <PublicProfile/>
    </div>
  );
}

export default ProfilePage;
