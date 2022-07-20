import IconButton from "components/IconButton";
import IconCircleDelete from "components/icons/IconCircleDelete";
import Loader from "components/Loader";
import IconReload from "components/icons/IconReload";
import IconWarningCircle from "components/icons/IconWarningCircle";
import Vote from "components/ProfilePage/_shared/Vote";
import Button from "components/Button";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "store/user/profile";
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
    }

  return (
    <div>
      <div
        className={styles.card}
        onClick={handleOnImageClick}
      >
        {attachment.loaded && (
          <>
            <img
              src={attachment.thumbnail || '/img/cards/card-bg-default.png'}
              alt={attachment.name}
              className={styles.thumbnail}
            />
              {isHiddenImage && (
              <div className={styles.thumbnailFader}>
                  <Button
                      text="Try Premium"
                      type="button"
                      fullWidth
                  />
              </div>)}
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
            <Loader/>
          </div>
        )}

        {attachment.error && (
          <>
            <div className={cn(
              styles.content,
              styles['content--error']
            )}>
              <IconReload className="mb-2"/>
              <div>Try again</div>
              <div className={styles.error}>
                <IconWarningCircle
                  className="mr-1"
                  size="xs"
                />
                Invalid photo size
              </div>
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
          className="mt-1"
        />
      )}
    </div>
  );
}

export default CardAttachment;
