import cn from "classnames";
import styles from "./index.module.scss";

function PublicBox(
  {
    children,
    className
  }
) {
  return (
    <div className={cn(
      styles.box,
      className
    )}>
      {children}
    </div>
  );
}

export default PublicBox;
