import { memo, useEffect, useState } from "react";
import Avatar from "components/Avatar";
import IconClose from "components/icons/IconClose";
import IconButton from "components/IconButton";
import Loader from "components/Loader";
import styles from "./index.module.scss";
import cn from "classnames";

const UserItem = ({
    _id,
    path,
    label,
    albumCount,
    onClick,
    onDelete,
    isPending,
}) => {
  const [loader, setLoader] = useState(false);

  const handleDeleteUser = (userId, e) => {
    e.stopPropagation();
    onDelete(userId);
    setLoader(true);
  };

  useEffect(() => {
    if (loader) !isPending && setLoader(false);
  }, [isPending]);

  return (
    <div
      className={styles.userWrapper}
      onClick={() => onClick(_id)}
    >
      <Avatar
        size="sm"
        thumb={path}
        name={label}
      />
      <div className={styles.nameWrapper}>
        <p>{label}</p>
      </div>
      <p className="text-normal text-md ml-1">
        ({albumCount === 1 ?
        `${albumCount} shared private album` :
        `${albumCount} shared private albums`})
      </p>
      {!loader ? (
        <IconButton
          className={styles['btn-close']}
          disabled={isPending}
          onClick={(e) => handleDeleteUser(_id, e)}
        >
          <IconClose color="#4B5064"/>
        </IconButton>
      ) : (
        <div className={cn(
          styles['btn--loader'],
          'px-1'
        )}
        >
          <Loader size="xs" />
        </div>
      )}
    </div>
)}

export default memo(UserItem);