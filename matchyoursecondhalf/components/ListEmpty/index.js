import cn from "classnames";
import styles from "./index.module.scss";

function ListEmpty({ text, className }) {
  return (
    <div className={cn(
      styles.empty,
      'title-xs text-bitter text-medium text-center color-blue-900',
      className
    )}>
      {text}
    </div>
  );
}

export default ListEmpty;
