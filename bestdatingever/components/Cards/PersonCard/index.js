import { useMemo } from "react";
import { userIsLogged } from "utils/userActions";
import { useSelector } from "react-redux";
import { auth } from "store/auth/auth";
import { userProfile } from "store/user/profile";
import Router from "next/router";
import Vote from "components/ProfilePage/_shared/Vote";
import styles from "./index.module.scss";

function PersonCard(person) {
  const currentToken = useSelector(auth.selectors.currentToken);
  const profile = useSelector(userProfile.selectors.profile);

  const goToProfile = () => {
    if (!userIsLogged()) return
    
    Router.push({
      pathname: '/profile/[userId]',
      query: { userId: person.user },
    });
  };
  
  const isLogged = useMemo(() => {
    return currentToken && Object.values(profile).length > 0;
  }, [currentToken, profile]);

  return (
    <div className={styles.card}>
      <div
        className={styles['card-photo']}
        onClick={goToProfile}
      >
        <img
          src={person.avatarPath || '/img/cards/card-bg-default.jpg'}
          alt={person.name}
          className={styles.avatar}
        />
      </div>
      
      <div className="d-flex align-items-baseline text-md text-semibold mt-1">
        <div>{person.name}, {person.age} y.o.</div>
        {person.online && <div className={styles.online}/>}
      </div>

      {isLogged && (
        <Vote
          heartCount={person.likes.heart}
          likeCount={person.likes.like}
          isUserPutHeart={person.likes.isUserPutHeart}
          isUserPutLike={person.likes.isUserPutLike}
          targetUserId={person.user}
          className="mt-1"
        />
      )}
      {/*<div className={styles['details__distance']}>{person.distance || 0} km from you</div>*/}
    </div>
  );
}

export default PersonCard;
