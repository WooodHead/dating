import MainLayout from 'layouts/Main';
import HandleAlbumCreate from "components/AccountPage/HandleAlbum/create";

CreatePublicAlbumPage.layouts = [MainLayout]

function CreatePublicAlbumPage() {
  return (
    <HandleAlbumCreate/>
  );
}

export default CreatePublicAlbumPage;
