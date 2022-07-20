import cn from "classnames";
import styles from "./index.module.scss";

function ListEmpty({ text }) {
  return (
    <div className={cn(
      styles.empty,
      'text-center'
    )}>
      {text}
    </div>
  );
}

export default ListEmpty;
