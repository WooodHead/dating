import PublicBox from "components/ProfilePage/PublicBox";
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
    <PublicBox>
      <PublicBoxTitle>Location</PublicBoxTitle>
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
              className={cn(styles['list__row'], 'text-xl')}
            >
              <div className="d-flex align-items-center text-bold text-nowrap mr-1">
                {item.title}:
              </div>
              <div className="color-cyan-500 text-italic">
                {item.value || '-'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PublicBox>
  );
}

export default PublicGeography;
