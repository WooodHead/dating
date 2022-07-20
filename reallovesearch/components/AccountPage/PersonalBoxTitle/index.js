import cn from "classnames";
import styles from "./index.module.scss";

function PersonalBoxTitle({ children }) {
  return (
    <div className={cn(
      styles.title,
      'text-medium color-blue-900 text-xl text-poppins mb-4'
    )}>
      {children}
    </div>
  );
}

export default PersonalBoxTitle;
