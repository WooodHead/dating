import { useMemo } from "react";
import { userIsLogged } from "utils/userActions";
import { useSelector } from "react-redux";
import { auth } from "store/auth/auth";
import { userProfile } from "store/user/profile";
import Router from "next/router";
import LastConnection from "components/ProfilePage/PublicDescription/LastConnection";
import Vote from "components/ProfilePage/_shared/Vote";
import cn from "classnames";
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
    <div>
      <div
        className={cn(
          styles.card,
          {[styles['card--filters-visible']]: person.filterIsVisible}
        )}
        onClick={goToProfile}
      >
        <img
          src={person.avatarPath || '/img/cards/card-bg-default.png'}
          alt={person.name}
          className={styles.avatar}
        />
      </div>
      <div className={styles.content}>
        <div className={cn(
          { [styles['details--with-bg']]: person.avatarPath }
        )}>
          <div className="d-flex align-items-baseline text-semibold text-lg mb-1 mb-sm-0 color-blue-900">
            <div className={styles['detail__title']}>{person.name}, {person.age}</div>
            {person.online && <div className={styles.online}/>}
          </div>
          <div className={cn(
            styles['detail__location'],
            'color-blue-900 text-md mb-1 mb-sm-0'
          )}>
            {person.location.cityName || ''}&#47;{person.distance}&nbsp;km from you
          </div>
          {person.online || (
            <div className={cn(
              styles['details__last-seen'],
              'color-grey-600 text-italic'
            )}>
              <LastConnection online={person.online} updatedAt={new Date(person.updatedAt)} />
            </div>
          )}
        </div>
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
    </div>
  );
}

export default PersonCard;
