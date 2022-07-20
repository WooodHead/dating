import AccountProfileLayout from "layouts/AccountProfile";
import MainLayout from 'layouts/Main';
import MyPublicAlbums from "components/AccountPage/PublicAlbums";
import { useSelector } from "react-redux";
import { userProfile } from "store/user/profile";

PublicAlbumsPage.layouts = [MainLayout, AccountProfileLayout];

function PublicAlbumsPage() {
  const profile = useSelector(userProfile.selectors.profile);
  const profileStatus = useSelector(userProfile.selectors.profileStatus);
  
  return (
    profileStatus === 'success' && (
      <MyPublicAlbums
        profile={profile}
      />
    )
  );
}

export default PublicAlbumsPage;
