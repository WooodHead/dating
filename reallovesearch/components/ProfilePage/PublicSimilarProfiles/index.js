import PublicBox from "components/ProfilePage/PublicBox";
import PublicBoxTitle from "components/ProfilePage/PublicBoxTitle";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { usersProfiles } from "store/users/profiles";
import { publicProfile } from "store/profile/public-profile";
import { searchParams } from "store/users/searchParams";
import Loader from "components/Loader";
import PersonCard from "components/Cards/PersonCard";
import styles from "./index.module.scss";

function PublicSimilarProfiles() {
  const dispatch = useDispatch();
  const similarProfiles = useSelector(usersProfiles.selectors.profiles);
  const requestStatus = useSelector(usersProfiles.selectors.status);
  const pubProfile = useSelector(publicProfile.selectors.profile);
  const searchParamsList = useSelector(searchParams.selectors.list);
  
  useEffect(() => {
    const params = { take: 3 };

    if (!searchParamsList?.location && pubProfile?.location?._id) params.location = pubProfile.location._id;

    dispatch(usersProfiles.thunks.getUsersProfiles(params));
    
    return () => dispatch(usersProfiles.actions.RESET_STATE());
  }, []);
  
  const formattedSimilarProfiles = useMemo(() => {
    return similarProfiles?.filter(profile => profile._id !== pubProfile._id);
  }, [similarProfiles]);
  
  return (
    <PublicBox>
      <PublicBoxTitle>Similar profiles</PublicBoxTitle>
      {requestStatus === 'pending' ? (
        <Loader size="sm"/>
      ) : (
        formattedSimilarProfiles.length > 0 ? (
          <div className={styles['card-wrap']}>
            {formattedSimilarProfiles.map(user => <PersonCard key={user._id} {...user}/>)}
          </div>
        ) : (
          <div className="text-md text-semibold color-blue-900 text-center">
            There are currently no similar profiles
          </div>
        )
      )}
    </PublicBox>
  );
}

export default PublicSimilarProfiles;
