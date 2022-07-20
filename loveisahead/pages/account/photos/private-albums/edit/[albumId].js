import AccountPhotosLayout from "layouts/AccountPhotos";
import HandleAlbum from "components/AccountPage/HandleAlbum/edit";
import MainLayout from "layouts/Main";

// import styles from "./index.module.scss";

EditPrivateAlbumPage.layouts = [MainLayout, AccountPhotosLayout]

function EditPrivateAlbumPage({data}) {

  return (
    <HandleAlbum
      title="Edit private album"
    />
  );
}

export async function getServerSideProps(ctx) { // only on pages
  console.log('=> ctx', ctx);
  // use params.albumId from object 'ctx'

  const res = await fetch(`https://randomuser.me/api/`);
  const data = await res.json();

  return {
    props: {
      data
    }
  }
}

export default EditPrivateAlbumPage;
