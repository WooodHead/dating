import PublicActions from "components/ProfilePage/PublicActions";
import PublicSimilarProfiles from "components/ProfilePage/PublicSimilarProfiles";
import PublicDescription from "components/ProfilePage/PublicDescription";
import PublicInformation from "components/ProfilePage/PublicInformation";
import PublicPhotos from "components/ProfilePage/PublicPhotos";
import Loader from "components/Loader";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { publicProfile } from "store/profile/public-profile";
import styles from "./index.module.scss";
import cn from "classnames";

function PublicProfile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userProfile = useSelector(publicProfile.selectors.profile);
  const profileStatus = useSelector(publicProfile.selectors.status);
  const userId = router.query.userId;
  
  useEffect(() => {
    if (userId && !Object.keys(userProfile).length) {
      dispatch(publicProfile.thunks.getPublicProfile(userId));
    }
  }, [userId]);
  
  if (['idle', 'pending'].includes(profileStatus)) {
    return <Loader/>;
  }
  
  return (
    <div className={styles.profile}>
      <div className={cn(
        styles.aside,
        'mb-4'
      )}>
        <PublicActions/>
        <PublicDescription/>
      </div>
      <div className={styles.content}>
        <PublicInformation/>
        <PublicPhotos />
        <PublicSimilarProfiles/>
      </div>
    </div>
  );
}



export default PublicProfile;
