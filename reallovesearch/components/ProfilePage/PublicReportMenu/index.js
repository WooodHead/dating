import { useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { publicProfile } from "store/profile/public-profile";
import { prepareSelectOptions } from "utils/preps";
import OutsideAlerter from "hooks/ClickOutside";
import PopupConfirm from "components/Popups/PopupConfirm";
import Loader from "components/Loader";
import TextAreaField from "components/Form/TextAreaField";
import MultiSelectField from "components/Form/MultiSelectField";
import styles from "./index.module.scss";

const restrictions = [
  'View your profile page and albums',
  'Find your profile page on Search page',
  'Write you messages and get them from you',
];

function PublicReportMenu() {
  const { control } = useForm({
    defaultValues: {
      reason: [],
    },
  });

  const dispatch = useDispatch();

  const profile = useSelector(publicProfile.selectors.profile);
  const [popupBlockUser, setPopupBlockUser] = useState(false);
  const [popupReportUser, setPopupReportUser] = useState(false);
  const blockUserStatus = useSelector(publicProfile.selectors.blockUserStatus);
  const reportUserStatus = useSelector(publicProfile.selectors.reportUserStatus);
  const listOfReasons = useSelector(publicProfile.selectors.listOfReasons);
  const prepareListOfReason = prepareSelectOptions(listOfReasons);
  const listOfReasonsStatus = useSelector(publicProfile.selectors.listOfReasonsStatus);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [yourOption, setYourOption] = useState('');
  const [dropdownIsVisible, setDropDownIsVisible] = useState(false);
  const addMenu = useRef(null);

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
    setDropDownIsVisible(false);
  };

  const onUnblockUser = async () => {
    await dispatch(publicProfile.thunks.relationsUser({
      targetUserId: profile.user,
      relation: 'Default'
    }));
    setDropDownIsVisible(false);
  };

  const handleReportUser = () => {
    setPopupReportUser(true);
    dispatch(publicProfile.thunks.getListOfReasons());
  };

  const onSelectReason = (reason) => {
    setSelectedReasons(reason)
  };

  const reportFormDisabled = useMemo(() => {
    return !(selectedReasons.length > 0 || yourOption.length > 0);
  }, [selectedReasons, yourOption]);

  const onReportUser = async () => {
    const list = selectedReasons.map((item) => item.value)
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
      <div className="cursor-pointer ml-auto position-relative">
        <div className={styles['add-menu']}
             ref={addMenu}
             onClick={() => setDropDownIsVisible(!dropdownIsVisible)}
        >
          <img
            src="/img/profile/icon-add-menu.svg"
            alt=""/>
        </div>
        {dropdownIsVisible && (
          <OutsideAlerter
            extraRefs={[addMenu]}
            close={() => setDropDownIsVisible(!dropdownIsVisible)}
          >
            <div className={styles.dropdown}>
              <div onClick={handleReportUser}>
                <div className="d-inline-flex align-items-center cursor-pointer mb-3">
                  <img
                    src="/img/profile/icon-report.svg"
                    alt=""
                    className="mr-1"
                  />
                  Report this member
                </div>
              </div>
              <div onClick={blockUnblockUser}>
                <div className="d-inline-flex align-items-center cursor-pointer">
                  <img
                    src="/img/profile/icon-block.svg"
                    alt=""
                    className="mr-1"
                  />
                  {profile.blockedTo ? 'Unblock this member' : 'Block this member'}
                </div>
              </div>
            </div>
          </OutsideAlerter>
        )}
      </div>

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
          btnCancelIsVisible={false}
          btnConfirmDisabled={reportFormDisabled}
          btnConfirmText="Apply"
          onConfirm={onReportUser}
          onCancel={() => setPopupReportUser(false)}
          onClose={() => setPopupReportUser(false)}
          loader={reportUserStatus === 'pending'}
        >
          <div className="mb-1">
            Report this member
          </div>
          <div className="mb-3 text-normal">
            Select the reason for report:
          </div>
          {listOfReasonsStatus === 'pending' ? (
            <Loader size="sm"/>
          ) : (
            <MultiSelectField
              name="reason"
              options={prepareListOfReason}
              control={control}
              placeholder="Select the reason"
              onChange={(reason) => onSelectReason(reason)}
              className={styles.select}
            />
          )}
          <div className="text-left">
            <TextAreaField
              name="yourOption"
              label="Your option"
              fullWidth
              onChange={(e) => setYourOption(e.target.value)}
            />
          </div>
        </PopupConfirm>
      )}
    </>

  )
}

export default PublicReportMenu