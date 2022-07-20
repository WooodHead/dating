import cn from "classnames";
import styles from "./index.module.scss";

function PublicBoxTitle({ children }) {
  return (
    <div className={cn(
      styles.title,
      'text-semibold text-palatino mb-3'
    )}>
      {children}
    </div>
  );
}

export default PublicBoxTitle;
