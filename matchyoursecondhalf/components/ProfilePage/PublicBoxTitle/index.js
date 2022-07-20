import cn from "classnames";
import styles from "./index.module.scss";

function PublicBoxTitle({ children }) {
  return (
    <div className={cn(
      styles.title,
      'text-semibold mb-2 color-blue-900'
    )}>
      {children}
    </div>
  );
}

export default PublicBoxTitle;
