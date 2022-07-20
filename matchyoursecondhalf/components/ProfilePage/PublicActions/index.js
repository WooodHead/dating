import { useRouter } from 'next/router';
import { useDispatch, useSelector } from "react-redux";
import { publicProfile } from "store/profile/public-profile";
import { useEffect, useMemo, useState } from "react";
import { chatsRoom } from "store/chats/room";
import { userProfile } from "store/user/profile";
import PopupConfirm from "components/Popups/PopupConfirm";
import Loader from "components/Loader";
import CheckboxField from "components/Form/CheckboxField";
import TextAreaField from "components/Form/TextAreaField";
import PopupNotification from "../../Popups/PopupNotification";
import Vote from "../_shared/Vote";
import cn from "classnames";
import styles from "./index.module.scss";

const restrictions = [
  'View your profile page and albums',
  'Find your profile page on Search page',
  'Write you messages and get them from you',
];

function PublicActions() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { avatarPath } = useSelector(publicProfile.selectors.profile);
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
      <div className={styles['title--mobile']}>
        <div className="title-sm text-bitter text-semibold color-blue-900">{profile.name}</div>
        <div className="text-md text-normal">
          <p>{profile.distance}&nbsp;km from you</p>
          Last connection today at 18:45
        </div>
      </div>
      <div className={cn(
        styles['public-box'],
        'position-relative mb-4 mb-md-0'
      )}>
      <div className={styles.avatar}>
        <img
          src={avatarPath || '/img/profile/avatar-bg-default.jpg'}
          alt=""
          className={styles['avatar__img']}
        />
      </div>
      <Vote
        heartCount={profile.likes.heart}
        likeCount={profile.likes.like}
        isUserPutHeart={profile.likes.isUserPutHeart}
        isUserPutLike={profile.likes.isUserPutLike}
        targetUserId={profile.user}
        className="my-2"
      />
      <div className={styles['actions-wrap']}>
        <div className={cn(
          styles['write-message'],
          'mt-2 mt-md-0 mb-3 pb-2'
        )}>
          <div className={cn(
            styles['write-message__button'],
            'd-flex justify-content-center align-items-center p-1 cursor-pointer text-md text-letter-1 color-blue-900'
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
        </div>
        <div className="pr-2 pl-2">
          <div className="mb-3">
            <div className="d-inline-flex align-items-center cursor-pointer text-md text-letter-0-3 color-blue-900">
              <div className={cn(
                styles['icon-wrap'],
                'mr-1'
              )}>
                <img
                  src="/img/profile/icon-give-access.svg"
                  alt=""
                />
              </div>
              Give access to your albums
            </div>
          </div>
          <div className="mb-3">
            <div className="d-inline-flex align-items-center cursor-pointer text-md text-letter-0-3 color-blue-900"
              onClick={handleReportUser}
            >
              <div className={cn(
                styles['icon-wrap'],
                'mr-1'
              )}>
                <img
                  src="/img/profile/icon-report.svg"
                  alt=""
                />
              </div>
              Report this member
            </div>
          </div>
          <div>
            <div className="d-inline-flex align-items-center cursor-pointer text-md text-letter-0-3 color-blue-900"
                 onClick={blockUnblockUser}
            >
              <div className={cn(
                styles['icon-wrap'],
                'mr-1'
              )}>
                <img
                  src="/img/profile/icon-block.svg"
                  alt=""
                />
              </div>
              {profile.blockedTo ? 'Unblock this member' : 'Block this member'}
            </div>
          </div>
        </div>
      </div>
    </div>

      {popupNotification && (
        <PopupNotification onClose={() => setPopupNotification(false)}>
          {profile.name} was blocked. You can unblock him/her by clicking Unblock button on &nbsp;
          <a
            href="#"
            className="color-blue-600 text-underline-link cursor-pointer"
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
          size="md"
          btnCancelIsVisible={false}
          btnConfirmText="Block this member"
          onConfirm={onBlockUser}
          onCancel={() => setPopupBlockUser(false)}
          onClose={() => setPopupBlockUser(false)}
          loader={blockUserStatus === 'pending'}
        >
          <div className="mb-3">
            Are you sure you want to block this user?<br/>
            Once locked, this user will no longer be able to:
          </div>
          {restrictions.map(res => (
            <div key={res} className="mb-1">
              - {res};
            </div>
          ))}
        </PopupConfirm>
      )}

      {popupReportUser && (
        <PopupConfirm
          btnCancelIsVisible={true}
          btnConfirmDisabled={reportFormDisabled}
          btnConfirmText="Send"
          onConfirm={onReportUser}
          onCancel={() => setPopupReportUser(false)}
          onClose={() => setPopupReportUser(false)}
          loader={reportUserStatus === 'pending'}
        >
          <div className="mb-3">
            Please select the reason for the report, mlm add your option.
          </div>
          {listOfReasonsStatus === 'pending' ? (
            <Loader size="sm"/>
          ) : (
            <div className="mb-4">
              {formattedListOfReasons.map(reason => (
              <div key={reason._id} className={cn(
                styles.reason,
                'd-flex align-items-center mb-2 text-normal'
              )}>
                <CheckboxField
                  name={`reason-${reason._id}`}
                  value={reason.checked}
                  className="mr-2"
                  onChange={(e) => onSelectReason(reason, e)}
                />
                <div>{reason.name}</div>
              </div>
              ))}
            </div>
          )}
          <TextAreaField
            name="yourOption"
            label="Your option"
            fullWidth
            onChange={(e) => setYourOption(e.target.value)}
          />
        </PopupConfirm>
      )}
    </>
  );
}

export default PublicActions;
