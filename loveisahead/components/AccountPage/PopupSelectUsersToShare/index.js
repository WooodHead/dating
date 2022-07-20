import { useMemo, useState, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { shareAlbums } from "store/users/share";
import Button from "components/Button";
import IconButton from "components/IconButton";
import IconClose from "components/icons/IconClose";
import AutocompleteField from "components/Form/AutocompleteField";
import styles from "./index.module.scss";

function PopupSelectUsersToShare(
    {
      onConfirm,
      onClose,
      onDelete,
    }
) {
  const dispatch = useDispatch();
  const shareUsers = useSelector(shareAlbums.selectors.shareUsers);
  const loadingShareUsersStatus = useSelector(shareAlbums.selectors.shareUsersStatus);
  const [selectedUser, setSelectedUser] = useState({});

  const isUserSelected = useMemo(() => Object.values(selectedUser).length > 0, [selectedUser]);
  const isShareUsersSearchPending = useMemo(() => loadingShareUsersStatus === 'pending', [loadingShareUsersStatus]);

  const onSelectUser = useCallback((user) => {
    setSelectedUser({...user});
  }, [selectedUser]);

  const onDeleteUser = useCallback(() => {
    setSelectedUser({});
    onDelete();
  },[]);

  const getUsers = useCallback(value => {
    dispatch(shareAlbums.thunks.getShareUsers({ name: value }));
  }, []);

  const onClearOptions = useCallback(() => {
    dispatch(shareAlbums.actions.RESET_USERS());
  }, []);

  const handleConfirmUser = () => {
    onConfirm(selectedUser);
  };

  const handleClosePopup = () => {
    dispatch(shareAlbums.actions.RESET_USERS());
    setSelectedUser({});
    onClose();
  }

  return (
      <div className={styles.overlay}>
        <div className={styles.popup}>
          <IconButton
              className={styles['icon-close']}
              onClick={handleClosePopup}
          >
            <IconClose/>
          </IconButton>
          <div className="text-xl text-semibold text-center mb-4 px-4">
            Please select user for whom you want to share
          </div>
          <div className="position-relative">
            <AutocompleteField
                options={shareUsers}
                fullWidth
                textWhite
                dark
                placeholder="Search"
                onSubmit={getUsers}
                value={selectedUser}
                onChange={setSelectedUser}
                loader={isShareUsersSearchPending}
                onClearOptions={onClearOptions}
                onHandleSelectedValue={onSelectUser}
                resetOuterState={() => onDeleteUser()}
                onClearButton
                searchIcon
            />
          </div>
          <div className={styles.actions}>
            <Button
                text="Share"
                textSize="md"
                onClick={handleConfirmUser}
                disabled={!isUserSelected}
            />
            <Button
                text="Cancel"
                textSize="md"
                outline
                onClick={handleClosePopup}
            />
          </div>
        </div>
      </div>
  );
}

export default memo(PopupSelectUsersToShare);
