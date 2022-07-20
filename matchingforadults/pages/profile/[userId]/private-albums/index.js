import MainLayout from "layouts/Main";
import PublicPrivateAlbums from "components/ProfilePage/PublicPrivateAlbums";

PrivateAlbums.layouts = [MainLayout];

function PrivateAlbums() {
  return <PublicPrivateAlbums />
}

export default PrivateAlbums