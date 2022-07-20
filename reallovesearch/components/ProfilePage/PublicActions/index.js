import PublicBox from "components/ProfilePage/PublicBox";
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from "react-redux";
import { publicProfile } from "store/profile/public-profile";
import { userProfile } from "store/user/profile";
import { useState } from "react";
import { chatsRoom } from "store/chats/room";
import Button from "components/Button";
import PublicReportMenu from "../PublicReportMenu";
import PopupNotification from "components/Popups/PopupNotification";
import Vote from "../_shared/Vote";
import cn from "classnames";
import styles from "./index.module.scss";

function PublicActions() {
  const dispatch = useDispatch();
  const router = useRouter();

  const profile = useSelector(publicProfile.selectors.profile);
  const myProfile = useSelector(userProfile.selectors.profile);
  const { avatarPath, name } = useSelector(publicProfile.selectors.profile);
  const [popupNotification, setPopupNotification] = useState(false);

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
      <PublicBox className={cn(
        styles.wrap,
        'position-relative'
      )}>
        <div className={cn(
          styles['title-wrap'],
          'd-flex align-items-baseline mb-2'
        )}>
          <div className={cn(
            styles.title,
            'mr-2'
          )}>
            <div className="title-sm text-semibold color-blue-900 mb-1 mb-md-0">{name}</div>
            <div className="text-italic text-normal color-grey-600 ml-3 ml-md-0">
              last seen 15:30
              <p>{profile.distance}&nbsp;km from you</p>
            </div>
          </div>
          <PublicReportMenu />
        </div>
        <div className={styles.avatar}>
          <img
            src={avatarPath || '/img/profile/avatar-bg-default.jpg'}
            alt=""
            className={styles['avatar__img']}
          />
        </div>
        <div className="mt-3">
          <Vote
            heartCount={profile.likes.heart}
            likeCount={profile.likes.like}
            isUserPutHeart={profile.likes.isUserPutHeart}
            isUserPutLike={profile.likes.isUserPutLike}
            targetUserId={profile.user}
            className="mb-3"
          />
          <div className="mb-3">
            <Button
              text={(
                <div className={cn(
                  styles.button,
                  'd-flex align-items-center'
                )}
                     onClick={goToChatRoom}
                >
                  <img
                    src="/img/profile/icon-write-message.svg"
                    alt=""
                    className="mr-1"
                  />
                  Write a message
                </div>
              )}
              textSize="md"
              fullWidth
            />
          </div>
          <div>
            <Button
              text={(
                <div className={cn(
                  styles.button,
                  'd-flex align-items-center'
                )}>
                  <img
                    src="/img/profile/icon-give-access.svg"
                    alt=""
                    className="mr-1"
                  />
                  Give access to your albums
                </div>
              )}
              textSize="md"
              fullWidth
              outline
            />
          </div>
        </div>
      </PublicBox>

      {popupNotification && (
        <PopupNotification onClose={() => setPopupNotification(false)}>
          {profile.name} was blocked. You can unblock him/her by clicking Unblock button on &nbsp;
          <a
            href="#"
            className="color-pink-300 text-underline-link cursor-pointer"
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

export default PublicActions;
