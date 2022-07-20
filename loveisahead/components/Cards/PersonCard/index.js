import { useMemo } from "react";
import { userIsLogged } from "utils/userActions";
import { useSelector } from "react-redux";
import { auth } from "store/auth/auth";
import { userProfile } from "store/user/profile";
import Router from "next/router";
import Vote from "components/ProfilePage/_shared/Vote";
import cn from "classnames";
import styles from "./index.module.scss";

function PersonCard({user, name, avatarPath, online, age, distance, likes, location, ...rest}) {

  const currentToken = useSelector(auth.selectors.currentToken);
  const profile = useSelector(userProfile.selectors.profile);
  
  const goToProfile = () => {
    if (!userIsLogged()) return
    
    Router.push({
      pathname: '/profile/[userId]',
      query: { userId: user },
    });
  };
  
  const isLogged = useMemo(() => {
    return currentToken && Object.values(profile).length > 0;
  }, [currentToken, profile]);
  
  return (
    <div>
      <div
        className={styles.card}
        onClick={goToProfile}
      >
        <img
          src={avatarPath || '/img/cards/card-bg-default.jpg'}
          alt={name}
          className={styles.avatar}
        />
        <div className={styles.content}>
          <div className={cn(
            styles.details,
            { [styles['details--with-bg']]: avatarPath }
          )}>
            <div className="d-flex align-items-baseline text-semibold mb-1 mb-md-0">
              <div className={styles['details__title']}>{name}, {age} y.o.</div>
              {online && <div className={styles.online}/>}
            </div>
            <div className={styles['details__distance']}>{distance !== 0 ?  `${distance} km from you` : location.cityName}</div>
          </div>
        </div>
      </div>
  
      {isLogged && (
        <Vote
          heartCount={likes.heart}
          likeCount={likes.like}
          isUserPutHeart={likes.isUserPutHeart}
          isUserPutLike={likes.isUserPutLike}
          targetUserId={user}
          className="mt-1"
        />
      )}
    </div>
  );
}

export default PersonCard;
