import AccountPhotosLayout from "layouts/AccountPhotos";
import ButtonInline from "components/ButtonInline";
import IconAddSolid from "@/img/buttons/icon-add-solid.svg";
import Router from "next/router";
import MainLayout from 'layouts/Main';
import { useSelector } from "react-redux";
import { userProfile } from "store/user/profile";
import MyPublicAlbums from "components/AccountPage/MyPhotos/PublicAlbums";
import cn from "classnames";
import styles from './index.module.scss'

PublicAlbumsPage.layouts = [MainLayout, AccountPhotosLayout];

function PublicAlbumsPage() {
  const profile = useSelector(userProfile.selectors.profile);

  return (
    <>
      <div className={cn(
        styles.wrap,
        'd-flex justify-content-between mb-3'
      )}>
        <div className="text-xl text-bold">
          My public albums
        </div>
        <ButtonInline
          className={styles.button}
          iconPrepend={
            <img src={IconAddSolid.src} alt=""/>
          }
          onClick={() => Router.push('/account/photos/public-albums/create')}
        >
          Add album
        </ButtonInline>
      </div>
  
      {!!Object.values(profile).length && <MyPublicAlbums profile={profile}/>}
    </>
  );
}

export default PublicAlbumsPage;
