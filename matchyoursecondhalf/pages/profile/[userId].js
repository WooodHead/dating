import { useEffect, useState } from "react";
import MainLayout from "layouts/Main";
import LinkBack from "components/LinkBack";
import PublicTabs from "components/ProfilePage/PublicTabs";
import PublicProfile from "components/ProfilePage/PublicProfile";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "store/user/profile";
import { publicProfile } from "store/profile/public-profile";
import { publicPhotos } from "store/profile/public-photos";
import { publicAlbums } from "store/profile/public-albums";
import { privateAlbums } from "store/profile/private-albums";
import PublicMainPhotos from "components/ProfilePage/PublicMainPhotos";
import PublicAlbums from "components/ProfilePage/PublicAlbums";
import PublicPrivateAlbums from "components/ProfilePage/PublicPrivateAlbums";
import styles from './index.module.scss'

ProfilePage.layouts = [MainLayout];
ProfilePage.accessMode = 'private';

function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const profile = useSelector(userProfile.selectors.profile);

  const tabs = [
    { slug: 'profile', text: 'Personal info' },
    { slug: 'mainPhotos', text: 'Main photos' },
    { slug: 'publicAlbums', text: 'Public albums' },
    { slug: 'privateAlbums', text: 'Private albums' },
  ];

  const [tabActive, setTabActive] = useState(tabs[0].slug);

  const handleOnTabClick = (e) => {
    const slug = e.slug;
    const isAccessibleAlbums = !profile.isPremiumUser && slug === 'publicAlbums' ||
        !profile.isPremiumUser && slug === 'privateAlbums';

    if (isAccessibleAlbums) {
      dispatch(userProfile.actions.TOGGLE_POPUP(true));
      return;
    }

    setTabActive(slug);
  }
  
  useEffect(() => {
    return () => {
      dispatch(publicProfile.actions.RESET_STATE())
      dispatch(publicPhotos.actions.RESET_STATE())
      dispatch(publicAlbums.actions.RESET_STATE())
      dispatch(privateAlbums.actions.RESET_STATE())
    }
  }, []);

  return (
    <div>
      <div className="mb-4 mb-md-3">
        <LinkBack
          text="Back to home"
          onClick={() => router.push('/')}
        />
      </div>
      <div className={styles['tabs-wrap']}>
        <PublicTabs
          tabs={tabs}
          tabActive={tabActive}
          onClick={handleOnTabClick}
        />
      </div>
      {tabActive === 'profile' && <PublicProfile/>}
      {tabActive === 'mainPhotos' && <PublicMainPhotos/>}
      {tabActive === 'publicAlbums' && <PublicAlbums/>}
      {tabActive === 'privateAlbums' && <PublicPrivateAlbums/>}
    </div>
  );
}

export default ProfilePage;
