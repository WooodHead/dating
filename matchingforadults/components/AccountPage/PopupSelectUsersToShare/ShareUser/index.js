import IconButton from "components/IconButton";
import IconClose from "components/icons/IconClose";
import Avatar from "components/Avatar";

// import styles from "./index.module.scss";

function ShareUser(
  {
    user,
    onDelete
  }
) {
  return (
    <div className="d-flex align-items-center mb-2">
      <Avatar
        size="xs"
        thumb={user.thumb}
        name={user.name}
      />
      <div className="text-semibold text-md ml-2">
        {user.name}
      </div>
      <IconButton
        className="ml-1"
        onClick={() => onDelete(user.id)}
      >
        <IconClose
          color="rgba(255, 255, 255, .5)"
          size="xs"
        />
      </IconButton>
    </div>
  );
}

export default ShareUser;
