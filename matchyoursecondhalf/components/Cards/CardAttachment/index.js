import IconButton from "components/IconButton";
import IconCircleDelete from "components/icons/IconCircleDelete";
import Loader from "components/Loader";
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
    voteActions = false,
    publicView = true,
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
              src={attachment.thumbnail || '/img/cards/card-bg-default.jpg'}
              alt={attachment.name}
              className={styles.thumbnail}
            />

          {isHiddenImage && (
              <div className={styles.thumbnailFader}>
                  <Button
                      text="Try Premium"
                      type="button"
                      fullWidth
                      dark
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
              <IconWarningCircle
                className="mb-1"
                size="sm"
              />
              <div className="color-red">Invalid photo size</div>
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
