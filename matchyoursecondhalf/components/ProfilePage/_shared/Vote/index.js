import IconLike from "components/icons/IconLike";
import IconHeart from "components/icons/IconHeart";
import { useDispatch } from "react-redux";
import { userVote } from "store/vote";
import cn from "classnames";

function Vote(
  {
    heartCount,
    likeCount,
    isUserPutHeart,
    isUserPutLike,
    targetUserId,
    photoId,
    className
  }
) {
  const dispatch = useDispatch();
  
  const onHeart = () => {
    if (targetUserId) dispatch(userVote.thunks.setUserHeart(targetUserId));
    if (photoId) dispatch(userVote.thunks.setPhotoHeart(photoId));
  };
  
  const onLike = () => {
    if (targetUserId) dispatch(userVote.thunks.setUserLike(targetUserId));
    if (photoId) dispatch(userVote.thunks.setPhotoLike(photoId));
  };
  
  return (
    <div className={cn(className, 'd-flex align-items-center color-blue-600')}>
      <div className="d-flex align-items-end mr-2">
        <IconHeart
          className="cursor-pointer mr-1"
          solid={isUserPutHeart}
          onClick={onHeart}
        />
        {heartCount}
      </div>
      <div className="d-flex align-items-end">
        <IconLike
          className="cursor-pointer mr-1"
          solid={isUserPutLike}
          onClick={onLike}
        />
        {likeCount}
      </div>
    </div>
  );
}

export default Vote;
