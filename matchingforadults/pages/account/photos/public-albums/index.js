import Router from "next/router";
import MainLayout from 'layouts/Main';
import MyPublicAlbums from "components/AccountPage/MyPhotos/PublicAlbums";
import Button from "components/Button";
import { useSelector } from "react-redux";
import { userProfile } from "store/user/profile";

PublicAlbumsPage.layouts = [MainLayout];

function PublicAlbumsPage() {
  const profile = useSelector(userProfile.selectors.profile);

  return (
    <>
      <div className="d-flex justify-content-between align-items-baseline mb-3">
        <div className="title-xs text-bold text-palatino">
          Public albums
        </div>
        <Button
          onClick={() => Router.push('/account/photos/public-albums/create')}
          className="text-bold p-2"
        >
          Add album
        </Button>
      </div>
  
      {!!Object.values(profile).length && <MyPublicAlbums profile={profile}/>}
    </>
  );
}

export default PublicAlbumsPage;
