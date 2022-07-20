import IconArrowBack from "components/icons/IconArrowBack";
import cn from "classnames";
import styles from "./index.module.scss";

function PublicAlbum(
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
      <div className="d-flex align-items-center text-xl text-semibold mb-1">
        {title}
      </div>
      <div className="d-flex align-items-center text-italic">
        {/*{amount}*/} {type}
        <div className={cn(styles.icon, 'ml-1')}>
          <IconArrowBack className="rotate-180" />
        </div>
      </div>
    </div>
  );
}

export default PublicAlbum;
