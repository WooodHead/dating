import AccountPhotosLayout from "layouts/AccountPhotos";
import MainLayout from 'layouts/Main';
import HandleAlbumCreate from "components/AccountPage/HandleAlbum/create";

CreatePublicAlbumPage.layouts = [MainLayout, AccountPhotosLayout]

function CreatePublicAlbumPage() {
  return (
    <HandleAlbumCreate/>
  );
}

export default CreatePublicAlbumPage;
