import { useState } from "react";
import { useRouter } from "next/router";
import { userProfile } from "store/user/profile";
import PublicBox from "components/ProfilePage/PublicBox";
import PopupNotification from "components/Popups/PopupNotification";
import LastConnection from "./LastConnection";
import { useDispatch, useSelector } from "react-redux";
import { publicProfile } from "store/profile/public-profile";
import { chatsRoom } from "store/chats/room";
import cn from "classnames";
import styles from "./index.module.scss";

function PublicDescription() {
  const router = useRouter();
  const dispatch = useDispatch();
  const profile = useSelector(publicProfile.selectors.profile);
  const {
    name,
    professional,
    age,
    status,
    languages,
    bio,
    location,
    updatedAt,
    online,
    distance,
  } = useSelector(publicProfile.selectors.profile);
  const [popupNotification, setPopupNotification] = useState(false);
  const myProfile = useSelector(userProfile.selectors.profile);

  const goToChatRoom = async () => {
    if (profile.blockedTo || profile.blockedFrom) {
      setPopupNotification(true);
      return
    }
    if (!myProfile.isPremiumUser) {
      dispatch(userProfile.actions.TOGGLE_POPUP(true));
      return
    }
    await dispatch(chatsRoom.actions.SET_TARGET_USER_ID(profile.user));
    await dispatch(chatsRoom.actions.SET_PROFILE({
      _id: profile._id,
      avatarPath: profile.avatarPath,
      name: profile.name,
      online: profile.online,
    }));
    router.push({
      pathname: '/chat/[[...slug]]',
      query: { slug: profile.chatLink },
    });
  };
  
  return (
    <>
      <PublicBox className="mb-5">
        <div className={cn(styles.title, 'mb-2')}>
          <div className={cn(styles['title__name'], 'text-semibold text-overflow')}>
            {name}
          </div>
  
          <div className={styles['btn-message']} onClick={goToChatRoom}>
            Write a message
          </div>
        </div>
        
        <div className="text-md text-italic text-palatino mb-2">
          <LastConnection online={online} updatedAt={updatedAt} />
          <p>{distance}&nbsp;km from you</p>
        </div>
        
        <div className="d-flex align-items-center mb-2">
          <div className={styles.position}>{age}</div>
          <div className={styles.position}>{professional || '-'}</div>
          <div>{status || '-'}</div>
        </div>
        
        <div className="mb-2">
          <div className="d-inline-flex text-semibold color-grey-700 mr-1">
            Location:
          </div>
          {location?.cityName || '-'}
        </div>
        
        <div className="mb-2">
          <div className="d-inline-flex text-semibold color-grey-700 mb-1">
            About me:
          </div>
          <div className="text-break-word text-italic">{bio || '-'}</div>
        </div>
        
        <div>
          <div className="d-inline-flex text-semibold color-grey-700 mr-1">
            Languages:
          </div>
          <span>
            {languages.length > 0 ? languages.map(lang => (
              <span
                key={lang._id}
                className={styles.language}
              >
              {lang.name}
            </span>
            )) : '-'}
          </span>
        </div>
      </PublicBox>
      
      {popupNotification && (
        <PopupNotification onClose={() => setPopupNotification(false)}>
          {profile.name} was blocked. You can unblock him/her by clicking Unblock button on &nbsp;
          <a
            href="#"
            className="color-gold-400 text-underline-link cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setPopupNotification(false);
            }}
          >
            {profile.name}'s Profile page
          </a>
        </PopupNotification>
      )}
    </>
  );
}

export default PublicDescription;
