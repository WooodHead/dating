import { useMemo, useCallback, memo, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { shareAlbums } from "store/users/share";
import { throttle } from "utils/throttle";
import IconButton from "components/IconButton";
import ShareUser from "./ShareUser";
import IconClose from "components/icons/IconClose";
import Button from "components/Button";
import styles from "../PopupSelectUsersToShare/index.module.scss";
import cn from "classnames";

function PopupAlbumSharedToUsers(
    {
        albumId,
        onClose,
    }
) {
    const dispatch = useDispatch();
    const containerRef = useRef();
    const usersList = useSelector(shareAlbums.selectors.usersAlbumSharedTo);
    const deleteUserStatus = useSelector(shareAlbums.selectors.deleteUserStatus);

    const isDeleteUserStatusPending = useMemo(() => deleteUserStatus === 'pending', [deleteUserStatus]);

    const onDeleteUser = useCallback(userId => {
        dispatch(shareAlbums.thunks.deleteSharedUser({ userId, albumId }));
    }, []);

    const handleClosePopup = () => {
        dispatch(shareAlbums.actions.RESET_USERS());
        onClose();
    }

    function handleContainerScroll() {
        if (!containerRef.current) return;
    }

    useEffect(() => {
        dispatch(shareAlbums.thunks.getUsersAlbumSharedTo(albumId));
    }, [albumId, deleteUserStatus]);

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <IconButton
                    className={styles['icon-close']}
                    onClick={handleClosePopup}
                >
                    <IconClose color="#EBEBEB" />
                </IconButton>
                <div className="text-xl text-semibold text-center mb-4 px-2">
                    These users can watch the album
                </div>
                <div
                    className={cn([styles.wrap, 'custom-scroll dark mb-2'])}
                    ref={containerRef}
                    onScroll={throttle(handleContainerScroll, 500)}
                >
                    {usersList.length > 0 ? usersList.map(user => (
                        <ShareUser
                            key={user._id}
                            user={user}
                            onDelete={onDeleteUser}
                            isPending={isDeleteUserStatusPending}
                        />
                    )) : (
                        <p className="text-lg">You have no users with access to this album</p>
                    )}
                </div>
                <div >
                    <Button
                        text="Close"
                        textSize="md"
                        outline
                        onClick={handleClosePopup}
                        fullWidth
                    />
                </div>
            </div>
        </div>
    );
}

export default memo(PopupAlbumSharedToUsers);
