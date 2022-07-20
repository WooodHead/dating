import { useState } from "react";
import PublicMainPhotos from "components/ProfilePage/PublicMainPhotos";
import PublicAlbums from "components/ProfilePage/PublicAlbums";
import PublicPrivateAlbums from "components/ProfilePage/PublicPrivateAlbums";
import cn from "classnames";
import styles from "./index.module.scss";

function PublicPhoto() {
  const tabs = [
    { slug: 'mainPhotos', name: 'Main photos' },
    { slug: 'publicAlbums', name: 'Public albums' },
    { slug: 'privateAlbums', name: 'Private albums' },
  ];

  const [tabActive, setTabActive] = useState(tabs[0].slug);

  return (
    <div>
      <div className="d-flex mb-2">
        {tabs.map(tab => (
          <div
            key={tab.slug}
            className={cn(
              styles.tab,
              'mr-3 cursor-pointer',
              { [styles['tab--active']]: tab.slug === tabActive }
            )}
            onClick={() => setTabActive(tab.slug)}
          >
            {tab.name}
          </div>
        ))}
      </div>
      <>
        {tabActive === 'mainPhotos' && <PublicMainPhotos/>}
        {tabActive === 'publicAlbums' && <PublicAlbums/>}
        {tabActive === 'privateAlbums' && <PublicPrivateAlbums/>}
      </>
    </div>
  );
}

export default PublicPhoto;
