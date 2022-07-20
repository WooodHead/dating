import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usersProfiles } from "store/users/profiles";
import { publicProfile } from "store/profile/public-profile";
import { searchParams } from "store/users/searchParams";
import PublicBox from "components/ProfilePage/PublicBox";
import PublicBoxTitle from "components/ProfilePage/PublicBoxTitle";
import Loader from "components/Loader";
import Avatar from "components/Avatar";
import cn from "classnames";
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
  
  const User = (user) => (
    <div className={styles.user}>
      <div className="d-flex">
        <Avatar
          thumb={user.avatarPath}
          name={user.name}
          className={cn(styles['user__avatar'], 'mr-1')}
        />
        <div className="d-flex flex-column text-overflow">
          <div className="text-semibold text-overflow">
            {user.name}
          </div>
          <div className="text-md text-italic">
            {user.location?.cityName || '-'}&#47;{user.distance}&nbsp;km from you
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <PublicBox className="p-3">
      <PublicBoxTitle>Similar profiles</PublicBoxTitle>
      {requestStatus === 'pending' ? (
        <Loader size="sm"/>
      ) : (
        formattedSimilarProfiles.length > 0 ? (
          formattedSimilarProfiles.map(user => <User key={user._id} {...user}/>)
        ) : (
          <div className="text-md text-spacing-1 text-center">No Similar profiles</div>
        )
      )}
    </PublicBox>
  );
}

export default PublicSimilarProfiles;
