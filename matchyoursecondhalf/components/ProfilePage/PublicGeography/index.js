import PublicBoxTitle from "components/ProfilePage/PublicBoxTitle";
import { useSelector } from "react-redux";
import { publicProfile } from "store/profile/public-profile";
import { usersProfiles } from "store/users/profiles";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import cn from "classnames";
import styles from "./index.module.scss";

const MapComponent = dynamic(() => import('components/MapComponent'), { ssr: false });

function PublicGeography() {
  const userProfile = useSelector(publicProfile.selectors.profile);
  const similarProfiles = useSelector(usersProfiles.selectors.profiles);
  
  const defaultList = [
    { slug: 'nationality', title: 'Nationality', value: userProfile.nationality?.name },
    { slug: 'ethnic', title: 'Ethnic Origin', value: userProfile.ethnic },
    { slug: 'location', title: 'Location', value: userProfile.location?.cityName },
  ];

  const user = useMemo(() => {
    const coordinates = userProfile.location?.location?.coordinates || [];

    return {
      _id: userProfile._id,
      name: userProfile.name,
      coordinates: coordinates.length > 0 ? [coordinates[1], coordinates[0]] : [],
    };
  }, [userProfile]);

  const formattedSimilarProfiles = useMemo(() => {
    return similarProfiles?.filter(profile => profile._id !== userProfile._id);
  }, [similarProfiles]);

  const profilesNearUser = useMemo(() => {
    return formattedSimilarProfiles?.map(profile => {
      const coordinates = profile.location?.location?.coordinates || [];

      return {
        _id: profile._id,
        name: profile.name,
        coordinates: coordinates.length > 0 ? [coordinates[1], coordinates[0]] : [],
      };
    });
  }, [formattedSimilarProfiles]);

  return (
    <>
      <PublicBoxTitle>Geography</PublicBoxTitle>
      <div className={styles.wrap}>
        <div className={styles['map-wrap']}>
          <MapComponent
            user={user}
            profilesNearUser={profilesNearUser}
          />
        </div>
        <div>
          {defaultList && defaultList.map(item => (
            <div
              key={item.slug}
              className={cn(styles['list__row'], 'text-md')}
            >
              <div className={cn(
                styles['list__title'],
                'd-flex align-items-center text-semibold text-letter-0-3 color-blue-900 mr-2'
              )}>
                {item.title}:
              </div>
              <div className="color-grey-600">{item.value || '-'}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default PublicGeography;
