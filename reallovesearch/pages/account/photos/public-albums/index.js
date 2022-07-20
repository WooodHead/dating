import AccountPhotosLayout from "layouts/AccountPhotos";
import Router from "next/router";
import MainLayout from 'layouts/Main';
import { useSelector } from "react-redux";
import { userProfile } from "store/user/profile";
import MyPublicAlbums from "components/AccountPage/MyPhotos/PublicAlbums";
import Button from "components/Button";

PublicAlbumsPage.layouts = [MainLayout, AccountPhotosLayout];

function PublicAlbumsPage() {
  const profile = useSelector(userProfile.selectors.profile);

  return (
    <>
      <div className="d-flex justify-content-between align-items-baseline mb-3">
        <div className="text-xl text-medium text-poppins color-blue-900 text-uppercase">
          Public albums
        </div>
        <Button
          onClick={() => Router.push('/account/photos/public-albums/create')}
          text="Add album"
          size="sm"
          className="p-2"
        />
      </div>
  
      {!!Object.values(profile).length && <MyPublicAlbums profile={profile}/>}
    </>
  );
}

export default PublicAlbumsPage;
