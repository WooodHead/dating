import PublicMainPhotos from "components/ProfilePage/PublicMainPhotos";
import PublicAlbums from "components/ProfilePage/PublicAlbums";
import PublicPrivateAlbums from "components/ProfilePage/PublicPrivateAlbums";
import { useSelector, useDispatch } from 'react-redux';
import { publicProfile } from "store/profile/public-profile";
import { userProfile } from "store/user/profile";
import cn from "classnames";
import styles from "./index.module.scss";

function PublicPhoto() {
  const dispatch = useDispatch();
  const profile = useSelector(userProfile.selectors.profile);
  const activeSubTab = useSelector(publicProfile.selectors.activeSubTab);
  const tabs = [
    { slug: 'mainPhotos', name: 'Main photos' },
    { slug: 'publicAlbums', name: 'Public albums' },
    { slug: 'privateAlbums', name: 'Private albums' },
  ];


  const handleOnTabClick = (slug) => {
      const isAccessibleAlbums = !profile.isPremiumUser && slug === 'publicAlbums' ||
          !profile.isPremiumUser && slug === 'privateAlbums';

      if (isAccessibleAlbums) {
          dispatch(userProfile.actions.TOGGLE_POPUP(true));
          return;
      }

    dispatch(publicProfile.actions.SET_SUB_TAB(slug));
  }

  return (
    <div>
      <div className={cn(
        styles.wrap,
        'd-flex mb-2 flex-wrap'
      )}>
        {tabs.map(tab => (
          <div
            key={tab.slug}
            className={cn(
              styles.tab,
              'mr-3 cursor-pointer',
              { [styles['tab--active']]: tab.slug === activeSubTab }
            )}
            onClick={() => handleOnTabClick(tab.slug)}
          >
            {tab.name}
          </div>
        ))}
      </div>
      <>
        {activeSubTab === 'mainPhotos' && <PublicMainPhotos/>}
        {activeSubTab === 'publicAlbums' && <PublicAlbums/>}
        {activeSubTab === 'privateAlbums' && <PublicPrivateAlbums/>}
      </>
    </div>
  );
}

export default PublicPhoto;
