import cn from "classnames";
import styles from "./index.module.scss";

function PersonalHeader({ children }) {
  return (
    <div className={cn(styles.header, 'text-medium')}>
      {children}
    </div>
  );
}

export default PersonalHeader;
