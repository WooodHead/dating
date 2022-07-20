import PublicBox from "components/ProfilePage/PublicBox";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from "react-redux";
import { publicProfile } from "store/profile/public-profile";
import { userProfile } from "store/user/profile";
import { chatsRoom } from "store/chats/room";
import { useEffect, useMemo, useState } from "react";
import PopupConfirm from "components/Popups/PopupConfirm";
import PopupNotification from "components/Popups/PopupNotification";
import TextAreaField from "components/Form/TextAreaField";
import Loader from "components/Loader";
import CheckboxField from "components/Form/CheckboxField";
import Vote from "../_shared/Vote";
import cn from "classnames";
import styles from "./index.module.scss";

const restrictions = [
  'View your profile page and albums',
  'Find your profile page on Search page',
  'Write you messages and get them from you',
];

function PublicActions() {
  const router = useRouter();
  const dispatch = useDispatch();
  const profile = useSelector(publicProfile.selectors.profile);
  const myProfile = useSelector(userProfile.selectors.profile);
  const [popupNotification, setPopupNotification] = useState(false);
  const [popupBlockUser, setPopupBlockUser] = useState(false);
  const [popupReportUser, setPopupReportUser] = useState(false);
  const blockUserStatus = useSelector(publicProfile.selectors.blockUserStatus);
  const reportUserStatus = useSelector(publicProfile.selectors.reportUserStatus);
  const listOfReasons = useSelector(publicProfile.selectors.listOfReasons);
  const listOfReasonsStatus = useSelector(publicProfile.selectors.listOfReasonsStatus);
  const [formattedListOfReasons, setFormattedListOfReasons] = useState([]);
  const [yourOption, setYourOption] = useState('');
  
  useEffect(() => {
    if (listOfReasons.length > 0) {
      setFormattedListOfReasons([...listOfReasons]);
    }
  }, [listOfReasons]);
  
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
  
  const blockUnblockUser = () => {
    if (profile.blockedTo) onUnblockUser();
    else setPopupBlockUser(true);
  };
  
  const onBlockUser = async () => {
    await dispatch(publicProfile.thunks.relationsUser({
      targetUserId: profile.user,
      relation: 'Block'
    }));
    setPopupBlockUser(false);
  };
  
  const onUnblockUser = async () => {
    await dispatch(publicProfile.thunks.relationsUser({
      targetUserId: profile.user,
      relation: 'Default'
    }));
  };
  
  const handleReportUser = () => {
    setPopupReportUser(true);
    dispatch(publicProfile.thunks.getListOfReasons());
  };
  
  const onSelectReason = (reason, checked) => {
    setFormattedListOfReasons(reasons => [...reasons.map(item => {
      if (item._id === reason._id) {
        return { ...item, checked };
      }
      return item;
    })])
  };
  
  const reportFormDisabled = useMemo(() => {
    return !(formattedListOfReasons.some(reason => reason.checked) || yourOption.length > 0);
  }, [formattedListOfReasons, yourOption]);
  
  const onReportUser = async () => {
    const list = formattedListOfReasons.filter(reason => reason.checked).map(reason => reason.name);
    const reason = [...list, yourOption].join(', ');
    
    if (reason.length <= 0) return
    
    const res = await dispatch(publicProfile.thunks.reportUser({
      targetUserId: profile.user,
      reason
    }));
    
    if (res?.payload?.status) {
      setPopupReportUser(false);
      setYourOption('');
    }
  };
  
  return (
    <>
      <PublicBox className={styles.wrap}>
        <div className={cn(styles.avatar, 'mb-2')}>
          <img
            src={profile.avatarPath || '/img/profile/avatar-bg-default.jpg'}
            alt=""
            className={styles['avatar__img']}
          />
        </div>
  
        <div className="d-flex align-items-center justify-content-center text-lg text-medium">
          <div className={styles.position}>{profile.professional || '-'}</div>
          <div className={cn(styles.position, 'text-italic')}>{profile.age} y.o</div>
          <div className="text-italic">{profile.status || '-'}</div>
        </div>

        <Vote
          heartCount={profile.likes.heart}
          likeCount={profile.likes.like}
          isUserPutHeart={profile.likes.isUserPutHeart}
          isUserPutLike={profile.likes.isUserPutLike}
          targetUserId={profile.user}
          className="justify-content-center mt-2"
        />
  
        <div className={styles.actions}>
          <div
            className={styles['actions__btn']}
            onClick={goToChatRoom}
          >
            <img
              src="/img/profile/icon-write-message.svg"
              alt=""
              className="icon-default"
            />
            <div className={styles['actions__btn-text']}>Write a message</div>
          </div>
    
          <div className={styles['actions__btn']}>
            <img
              src="/img/profile/icon-share.svg"
              alt=""
              className="icon-default"
            />
            <div className={styles['actions__btn-text']}>Give access to your albums</div>
          </div>
    
          <div
            className={styles['actions__btn']}
            onClick={handleReportUser}
          >
            <img
              src="/img/profile/icon-report.svg"
              alt=""
              className="icon-default"
            />
            <div className={styles['actions__btn-text']}>Report this member</div>
          </div>
    
          <div
            className={styles['actions__btn']}
            onClick={blockUnblockUser}
          >
            {profile.blockedTo ? (
              <>
                <img
                  src="/img/profile/icon-unblock.svg"
                  alt=""
                  className="icon-default"
                />
                <div className={styles['actions__btn-text']}>Unblock this member</div>
              </>
            ) : (
              <>
                <img
                  src="/img/profile/icon-block.svg"
                  alt=""
                  className="icon-default"
                />
                <div className={styles['actions__btn-text']}>Block this member</div>
              </>
            )}
          </div>
        </div>
      </PublicBox>
      
      {popupNotification && (
        <PopupNotification onClose={() => setPopupNotification(false)}>
          {profile.name} was blocked. You can unblock him/her by clicking Unblock button on &nbsp;
          <a
            href="#"
            className="color-cyan-500 text-underline-link cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setPopupNotification(false);
            }}
          >
            {profile.name}'s Profile page
          </a>
        </PopupNotification>
      )}
      
      {popupBlockUser && (
        <PopupConfirm
          btnConfirmText="Block"
          btnCancelText="Cancel"
          onConfirm={onBlockUser}
          onCancel={() => setPopupBlockUser(false)}
          onClose={() => setPopupBlockUser(false)}
          loader={blockUserStatus === 'pending'}
        >
          <div className="text-xl mb-5">
            Are you sure<br/> you want to block this user?<br/>
            Once locked, this user will no longer be able to:
          </div>
          <div className="text-left mb-4">
            {restrictions.map(res => (
              <div key={res} className="mb-1">
                - {res};
              </div>
            ))}
          </div>
        </PopupConfirm>
      )}
      
      {popupReportUser && (
        <PopupConfirm
          btnConfirmDisabled={reportFormDisabled}
          btnConfirmText="Report"
          btnCancelText="Cancel"
          onConfirm={onReportUser}
          onCancel={() => setPopupReportUser(false)}
          onClose={() => setPopupReportUser(false)}
          loader={reportUserStatus === 'pending'}
        >
          <div className="text-xl mb-5">
            Please select the reason for the report, mlm add your option.
          </div>
          <div className="mb-5">
            {listOfReasonsStatus === 'pending' ? (
              <Loader size="sm"/>
            ) : (
              formattedListOfReasons.map(reason => (
                <div key={reason._id} className={cn(
                  styles.reason,
                  'd-flex align-items-center text-default mb-2'
                )}>
                  <CheckboxField
                    name={`reason-${reason._id}`}
                    value={reason.checked}
                    className="mr-2"
                    onChange={(e) => onSelectReason(reason, e)}
                  />
                  <div>{reason.name}</div>
                </div>
              ))
            )}
          </div>
          <TextAreaField
            placeholder="Wright a reason"
            name="yourOption"
            fullWidth
            value={yourOption}
            onChange={(e) => setYourOption(e.target.value)}
            sizeHeight="xs"
          />
        </PopupConfirm>
      )}
    </>
  );
}

export default PublicActions;
