import { memo } from "react";
import Avatar from "components/Avatar";
import IconClose from "components/icons/IconClose";
import IconButton from "components/IconButton";
import styles from "./index.module.scss";

const UserItem = ({_id, path, label, albumCount, onClick, onDelete}) => (
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
    <IconButton
      className={styles['btn-close']}
      onClick={onDelete}
    >
      <IconClose color="#4B5064" />
    </IconButton>
  </div>
);

export default memo(UserItem);