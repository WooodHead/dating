import HandleAlbumCreate from "components/AccountPage/HandleAlbum/create";
import MainLayout from 'layouts/Main';

CreatePrivateAlbumPage.layouts = [MainLayout];

function CreatePrivateAlbumPage() {
  return (
    <HandleAlbumCreate />
  );
}

export default CreatePrivateAlbumPage;
