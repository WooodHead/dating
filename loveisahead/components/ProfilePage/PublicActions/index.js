import PublicBox from "components/ProfilePage/PublicBox";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from "react-redux";
import { publicProfile } from "store/profile/public-profile";
import { chatsRoom } from "store/chats/room";
import { useEffect, useMemo, useState } from "react";
import { userProfile } from "store/user/profile";
import { userShareAlbums } from "store/user/share-albums";
import PopupConfirm from "components/Popups/PopupConfirm";
import PopupNotification from "components/Popups/PopupNotification";
import TextAreaField from "components/Form/TextAreaField";
import Loader from "components/Loader";
import CheckboxField from "components/Form/CheckboxField";
import LastConnection from "../PublicDescription/LastConnection";
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
  const shareAlbums = useSelector(userShareAlbums.selectors.shareAlbums);
  const shareAlbumStatus = useSelector(userShareAlbums.selectors.shareAlbumsStatus);
  const getShareAlbumsStatus = useSelector(userShareAlbums.selectors.shareAlbumsStatus);
  const [popupNotification, setPopupNotification] = useState(false);
  const [popupBlockUser, setPopupBlockUser] = useState(false);
  const [popupReportUser, setPopupReportUser] = useState(false);
  const [popupShareAlbums, setPopupShareAlbums] = useState(false);
  const blockUserStatus = useSelector(publicProfile.selectors.blockUserStatus);
  const reportUserStatus = useSelector(publicProfile.selectors.reportUserStatus);
  const listOfReasons = useSelector(publicProfile.selectors.listOfReasons);
  const listOfReasonsStatus = useSelector(publicProfile.selectors.listOfReasonsStatus);
  const [listOfShareAlbums, setListOfShareAlbums] = useState([]);
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

  const onCloseSharePopup = () => {
    setPopupShareAlbums(false);
    setListOfShareAlbums([]);
  }

  const handleShareAlbums = async () => {
    setPopupShareAlbums(true);
    await dispatch(userShareAlbums.thunks.getShareAlbums({userId: myProfile.user}))
  }

  const onSelectAlbum = (albumId, e) => {
    if(e) {
      setListOfShareAlbums(prevState => [...prevState, albumId])
    } else {
      setListOfShareAlbums((prevState => prevState.filter((item) => item !== albumId)))
    }
  }

  const onShareAlbums = async () => {
    await dispatch(userShareAlbums.thunks.shareAlbumsThunk({albumsIds: [...listOfShareAlbums], userId: profile.user}))
    setPopupShareAlbums(false);
    setListOfShareAlbums([]);
  }
  
  return (
    <>
      <div className={styles['title--mobile']}>
        <div className="title-sm text-semibold color-blue-700">{profile.name}</div>
        <div className="text-md text-italic text-normal text-lato">
          <LastConnection online={profile.online} updatedAt={profile.updatedAt} />
          <p>{profile.distance}&nbsp;km from you</p>
        </div>
      </div>
      <PublicBox className={cn(
        styles['public-box'],
        'position-relative mb-4'
      )}>
        <div className={styles.avatar}>
          <img
            src={profile.avatarPath || '/img/profile/avatar-bg-default.jpg'}
            alt=""
            className={styles['avatar__img']}
          />
        </div>
        <div className="p-3">
          <Vote
            heartCount={profile.likes.heart}
            likeCount={profile.likes.like}
            isUserPutHeart={profile.likes.isUserPutHeart}
            isUserPutLike={profile.likes.isUserPutLike}
            targetUserId={profile.user}
            className="mb-3"
          />
          <div>
            <div
              className="d-inline-flex align-items-center cursor-pointer mb-3"
              onClick={goToChatRoom}
            >
              <img
                src="/img/profile/icon-write-message.svg"
                alt=""
                className="icon-default icon-default--lg mr-1"
              />
              Write a message
            </div>
          </div>
          <div>
            <div
              className="d-inline-flex align-items-center cursor-pointer mb-3"
              onClick={handleShareAlbums}
            >
              <img
                src="/img/profile/icon-give-access.svg"
                alt=""
                className="icon-default icon-default--lg mr-1"
              />
              Give access to your albums
            </div>
          </div>
          <div>
            <div
              className="d-inline-flex align-items-center cursor-pointer mb-3"
              onClick={handleReportUser}
            >
              <img
                src="/img/profile/icon-report.svg"
                alt=""
                className="icon-default icon-default--lg mr-1"
              />
              Report this member
            </div>
          </div>
          <div>
            <div
              className="d-inline-flex align-items-center cursor-pointer"
              onClick={blockUnblockUser}
            >
              <img
                src="/img/profile/icon-block.svg"
                alt=""
                className="icon-default icon-default--lg mr-1"
              />
              {profile.blockedTo ? 'Unblock this member' : 'Block this member'}
            </div>
          </div>
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
            Are you sure you want to block this user?<br />
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
          btnCancelIsVisible={false}
          btnConfirmDisabled={reportFormDisabled}
          btnConfirmText="Apply"
          onConfirm={onReportUser}
          onCancel={() => setPopupReportUser(false)}
          onClose={() => setPopupReportUser(false)}
          loader={reportUserStatus === 'pending'}
        >
          <div className="mb-3">
            Please select the reason for the report, mlm add your option.
          </div>
          {listOfReasonsStatus === 'pending' ? (
            <Loader size="sm" />
          ) : (
            formattedListOfReasons.map(reason => (
              <div key={reason._id} className={cn(
                styles.reason,
                'd-flex align-items-center px-5 mb-2 text-normal'
              )}>
                <CheckboxField
                  name={`reason-${reason._id}`}
                  value={reason.checked}
                  className="mr-2"
                  onChange={(e) => onSelectReason(reason, e)}
                  dark
                />
                <div>{reason.name}</div>
              </div>
            ))
          )}
          <TextAreaField
            name="yourOption"
            label="Your option"
            dark
            fullWidth
            onChange={(e) => setYourOption(e.target.value)}
          />
        </PopupConfirm>
      )}

      {popupShareAlbums && (
        <PopupConfirm
          btnConfirmDisabled={!listOfShareAlbums.length}
          btnConfirmText="Send"
          onConfirm={onShareAlbums}
          onCancel={onCloseSharePopup}
          onClose={onCloseSharePopup}
          loader={shareAlbumStatus === 'pending'}
        >
          <div className="mb-3">
            Select the albums you want to share with user.
          </div>
          {getShareAlbumsStatus === 'pending' ? (
            <Loader size="sm" />
          ) : (
            <div className={cn(
              styles['list-share-albums'],
              'mb-3 custom-scroll'
            )}>
              {shareAlbums.map((album) => (
                <div key={album._id} className="d-flex align-items-center mb-2">
                  <CheckboxField
                    name={`album-${album._id}`}
                    className="mr-2"
                    onChange={(e) => onSelectAlbum(album._id, e)}
                    dark
                  />
                  <img
                    className={cn(
                      styles['album-photo'],
                      'mr-2'
                    )}
                    src={album.titlePhoto}
                    alt=""
                  />
                  <div>{album.name}</div>
                </div>
              ))}
            </div>
          )}
        </PopupConfirm>
      )}
    </>
  );
}

export default PublicActions;
