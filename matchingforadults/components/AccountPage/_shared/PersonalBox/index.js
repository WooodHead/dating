import cn from "classnames";
import styles from "./index.module.scss";

function PersonalBox({ className, children }) {
  return (
    <div className={cn(styles.box, className, 'mb-4')}>
      {children}
    </div>
  );
}

export default PersonalBox;
