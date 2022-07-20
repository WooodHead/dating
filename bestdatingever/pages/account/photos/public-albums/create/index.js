import AccountProfileLayout from "layouts/AccountProfile";
import MainLayout from 'layouts/Main';
import HandleAlbumCreate from "components/AccountPage/HandleAlbum/create";

CreatePublicAlbumPage.layouts = [MainLayout, AccountProfileLayout]

function CreatePublicAlbumPage() {
  return (
    <HandleAlbumCreate/>
  );
}

export default CreatePublicAlbumPage;
