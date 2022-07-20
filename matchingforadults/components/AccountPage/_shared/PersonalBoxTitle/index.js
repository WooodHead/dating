import styles from "./index.module.scss";
import cn from "classnames";

function PersonalBoxTitle({ children, className }) {
  return (
    <div className={cn(styles.title, className, 'text-xxl text-bold text-palatino mb-4')}>
      {children}
    </div>
  );
}

export default PersonalBoxTitle;
