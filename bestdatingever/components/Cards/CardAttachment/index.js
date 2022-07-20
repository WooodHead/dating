import IconButton from "components/IconButton";
import IconCircleDelete from "components/icons/IconCircleDelete";
import Loader from "components/Loader";
import IconReload from "components/icons/IconReload";
import IconWarningCircle from "components/icons/IconWarningCircle";
import Button from "components/Button";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "store/user/profile";
import Vote from "components/ProfilePage/_shared/Vote";
import cn from "classnames";
import styles from "./index.module.scss";

function CardAttachment(
  {
    attachment,
    onClick = () => {
    },
    onDelete = () => {
    },
    btnDelete = false,
    className,
    voteActions = false,
    isBlurred = false,
    index,
  }
) {
    const dispatch = useDispatch();
    const { isPremiumUser } = useSelector(userProfile.selectors.profile);
    const isHiddenImage = !isPremiumUser && isBlurred;

    const handleOnImageClick = () => {
        if (isHiddenImage) {
            dispatch(userProfile.actions.TOGGLE_POPUP(true));
            return
        }
        onClick();
    };

  return (
    <>
      <div className={cn(styles.card, className)} onClick={handleOnImageClick}>
        {attachment.loaded && (
          <>
            <img
              src={attachment.thumbnail || '/img/cards/card-bg-default.jpg'}
              alt={attachment.name}
              className={styles.thumbnail}
            />
              {isHiddenImage && (
                  <div className={styles.thumbnailFader}>
                      <Button
                          type="button"
                          fullWidth
                      >Try Premium</Button>
                  </div>
              )}
            <div className={styles.content}>
              {btnDelete && (
                <IconButton
                  className={styles['icon-delete']}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(attachment._id);
                  }}
                >
                  <IconCircleDelete/>
                </IconButton>
              )}
            </div>
          </>
        )}

        {attachment.inProcess && (
          <div className={cn(
            styles.content,
            styles['content--in-process']
          )}>
            <Loader color="white"/>
          </div>
        )}

        {attachment.error && (
          <>
            <div className={cn(
              styles.content,
              styles['content--error']
            )}>
              <div className={styles.error}>
                <IconWarningCircle
                  className="mr-1"
                />
                Invalid photo size
              </div>
              <IconReload className={cn(styles['icon-reload'], 'mb-2')} />
              <div className={styles.text}>Try again</div>
            </div>
          </>
        )}
      </div>

      {voteActions && (
        <Vote
          heartCount={attachment.likes.heart}
          likeCount={attachment.likes.like}
          isUserPutHeart={attachment.likes.isUserPutHeart}
          isUserPutLike={attachment.likes.isUserPutLike}
          photoId={attachment._id}
          className="mt-2 mb-3"
        />
      )}
    </>
  );
}

export default CardAttachment;
