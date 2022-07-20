import IconPlus from "components/icons/IconPlus";
import cn from "classnames";
import styles from "./index.module.scss";

function PersonalAlbum(
  {
    title,
    amount,
    type,
    className,
    onClick = () => {
    }
  }
) {
  return (
    <div className={cn(styles.box, className)} onClick={onClick}>
      <div className="d-flex align-items-center text-xl text-medium mb-2">
        <div className={cn(styles.icon, 'mr-1')}>
          <IconPlus />
        </div>
        {title}
      </div>
      <div className="text-italic">{amount} {type}</div>
    </div>
  );
}

export default PersonalAlbum;
