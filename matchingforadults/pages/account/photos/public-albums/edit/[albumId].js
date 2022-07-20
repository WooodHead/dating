import MainLayout from 'layouts/Main';
import HandleAlbumEdit from "components/AccountPage/HandleAlbum/edit";
import { useSelector } from "react-redux";
import { userProfile } from "store/user/profile";

EditPublicAlbumPage.layouts = [MainLayout];

function EditPublicAlbumPage() {
  const profile = useSelector(userProfile.selectors.profile);
  
  return !!Object.values(profile).length && <HandleAlbumEdit/>;
}

export default EditPublicAlbumPage;
