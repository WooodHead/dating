import PublicBox from "components/ProfilePage/PublicBox";
import { useDispatch, useSelector } from "react-redux";
import { publicProfile } from "store/profile/public-profile";
import { useMemo, useState } from "react";
import PopupConfirm from "components/Popups/PopupConfirm";
import TextAreaField from "components/Form/TextAreaField";
import Loader from "components/Loader";
import MultiSelectField from "components/Form/MultiSelectField";
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
  const profile = useSelector(publicProfile.selectors.profile);
  const [popupBlockUser, setPopupBlockUser] = useState(false);
  const [popupReportUser, setPopupReportUser] = useState(false);
  const blockUserStatus = useSelector(publicProfile.selectors.blockUserStatus);
  const reportUserStatus = useSelector(publicProfile.selectors.reportUserStatus);
  const listOfReasons = useSelector(publicProfile.selectors.listOfReasons);
  const listOfReasonsStatus = useSelector(publicProfile.selectors.listOfReasonsStatus);
  const [selectedListOfReasons, setSelectedListOfReasons] = useState([]);
  const [yourOption, setYourOption] = useState('');
  
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
  
  const onSelectReason = (options) => {
    setSelectedListOfReasons([...options]);
  };
  
  const reportFormDisabled = useMemo(() => {
    return selectedListOfReasons.length > 0 || yourOption.length > 0;
  }, [selectedListOfReasons, yourOption]);
  
  const onReportUser = async () => {
    const list = selectedListOfReasons.map(reason => reason.value);
    const reason = [...list, yourOption].join(', ');
    
    if (reason.length <= 0) return
    
    const res = await dispatch(publicProfile.thunks.reportUser({
      targetUserId: profile.user,
      reason
    }));

    if (res?.payload?.status) onClosePopupReportUser();
  };
  
  const onClosePopupReportUser = () => {
    setSelectedListOfReasons([]);
    setYourOption('');
    setPopupReportUser(false);
  };
  
  return (
    <>
      <div className={cn(styles.avatar, 'mb-3 mb-md-0 mb-sm-3')}>
        <img
          src={profile.avatarPath || '/img/profile/avatar-bg-default.jpg'}
          alt=""
          className={styles['avatar__img']}
        />
      </div>
      
      <PublicBox className={cn(styles.actions, 'mb-5 mb-md-0')}>
        <Vote
          heartCount={profile.likes.heart}
          likeCount={profile.likes.like}
          isUserPutHeart={profile.likes.isUserPutHeart}
          isUserPutLike={profile.likes.isUserPutLike}
          targetUserId={profile.user}
          className="mb-2"
        />
        <div className={styles.line} />
        <div className="d-inline-flex align-items-center cursor-pointer">
          <img
            src="/img/profile/icon-give-access.svg"
            alt=""
            className="icon-default icon-default--lg mr-1"
          />
          Give access to your albums
        </div>
        <div className={styles.line} />
        <div
          className="d-inline-flex align-items-center cursor-pointer mb-2"
          onClick={handleReportUser}
        >
          <img
            src="/img/profile/icon-report.svg"
            alt=""
            className="icon-default icon-default--lg mr-1"
          />
          Report this member
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
      </PublicBox>
      
      {popupBlockUser && (
        <PopupConfirm
          title="Block this member"
          size="md"
          btnConfirmText="Block"
          onConfirm={onBlockUser}
          onCancel={() => setPopupBlockUser(false)}
          onClose={() => setPopupBlockUser(false)}
          loader={blockUserStatus === 'pending'}
        >
          <div className="text-center">
            <div className="mb-3">
              Are you sure you want to block this user?<br />
              Once locked, this user will no longer be able to:
            </div>
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
          title="Report this member"
          btnConfirmDisabled={!reportFormDisabled}
          btnConfirmText="Send"
          onConfirm={onReportUser}
          onCancel={onClosePopupReportUser}
          onClose={onClosePopupReportUser}
          loader={reportUserStatus === 'pending'}
        >
          <div className="text-center mb-3">
            Select the reason for report:
          </div>
          {listOfReasonsStatus === 'pending' ? (
            <Loader size="sm" />
          ) : (
            <MultiSelectField
              value={selectedListOfReasons}
              options={listOfReasons}
              fullWidth
              placeholder="Select the reason"
              onChange={onSelectReason}
            />
          )}
          <TextAreaField
            name="yourOption"
            label="Your option"
            fullWidth
            outline
            defaultAreaHeight={80}
            value={yourOption}
            onChange={(e) => setYourOption(e.target.value)}
          />
        </PopupConfirm>
      )}
    </>
  );
}

export default PublicActions;
