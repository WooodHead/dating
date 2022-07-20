import cn from "classnames";
import styles from "./index.module.scss";

function PublicBoxTitle({ children }) {
  return (
    <div className={cn(
      styles.title,
      'text-semibold text-gilroy mb-2'
    )}>
      {children}
    </div>
  );
}

export default PublicBoxTitle;
