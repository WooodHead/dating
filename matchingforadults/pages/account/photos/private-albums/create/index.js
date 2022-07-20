import HandleAlbumCreate from "components/AccountPage/HandleAlbum/create";
import MainLayout from 'layouts/Main';

// import styles from "./index.module.scss";
CreatePrivateAlbumPage.layouts = [MainLayout]

function CreatePrivateAlbumPage() {

  console.log('=> CreatePrivateAlbumPage');

  return (
    <HandleAlbumCreate />
  );
}

export default CreatePrivateAlbumPage;
