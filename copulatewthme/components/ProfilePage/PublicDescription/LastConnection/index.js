import { formatRelative, isValid } from "date-fns";
import enUS from 'date-fns/locale/en-US';
import cn from "classnames";
import styles from "./index.module.scss";

function LastConnection({ online, updatedAt }) {
  if (!isValid(updatedAt)) return 'Last connection (Invalid date)';
  
  if (online) return <div className={cn(styles.online, 'text-lg')}>online</div>
  
  const formatRelativeLocale = {
    lastWeek: "'last' eeee",
    yesterday: "'yesterday at' HH:mm",
    today: "'today at' HH:mm",
    // tomorrow: "'tomorrow'",
    // nextWeek: "'Next' eeee",
    other: 'dd.MM.yyyy',
  };
  
  const locale = {
    ...enUS,
    formatRelative: (token) => formatRelativeLocale[token],
  };
  
  return (
    <>
      Last connection {formatRelative(updatedAt, new Date(), { locale })}
    </>
  );
}

export default LastConnection;
