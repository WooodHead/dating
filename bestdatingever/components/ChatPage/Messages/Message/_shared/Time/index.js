import styles from "./index.module.scss";
import format from "date-fns/format"

function Time({date}) {
  return (
    <span className={styles.wrap}>
      {format(new Date(date), 'HH:mm')}
    </span>
  );
}

export default Time;
