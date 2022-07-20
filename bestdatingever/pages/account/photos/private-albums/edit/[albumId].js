import HandleAlbum from "components/AccountPage/HandleAlbum/edit";
import MainLayout from "layouts/Main";

EditPrivateAlbumPage.layouts = [MainLayout];

function EditPrivateAlbumPage() {
  return (
    <HandleAlbum
      title="Edit private album"
    />
  );
}

export default EditPrivateAlbumPage;
