import cn from "classnames";
import styles from "./index.module.scss";

function Tabs(
  {
    tabs,
    tabActive,
    onChange,
    className
  }
) {
  return (
    <div className={cn([styles.tabs, className])}>
      {tabs.map((tab) => (
        <div
          key={tab.value}
          className={cn(
            styles.tab,
            'text-md',
            { [styles['tab--active']]: tabActive === tab.value }
          )}
          onClick={() => onChange(tab.value)}
        >
          {tab.name}
        </div>
      ))}
    </div>
  );
}

export default Tabs;
