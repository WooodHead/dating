import AccountPhotosLayout from "layouts/AccountPhotos";
import HandleAlbumCreate from "components/AccountPage/HandleAlbum/create";
import MainLayout from 'layouts/Main';

// import styles from "./index.module.scss";
CreatePrivateAlbumPage.layouts = [MainLayout, AccountPhotosLayout]

function CreatePrivateAlbumPage() {

  return (
    <HandleAlbumCreate />
  );
}

export default CreatePrivateAlbumPage;
