import cn from "classnames";
import styles from "./index.module.scss";

function PublicTabs(
  {
    tabs,
    tabActive,
    onClick
  }
) {
  return (
    <div className={styles.list}>
      {tabs.map(tab => (
        <div
          key={tab.text}
          className={cn(
            styles['list__item'],
            { [styles['list__item--active']]: tab.slug === tabActive },
            'text-uppercase'
          )}
          onClick={() => onClick(tab.slug)}
        >
          {tab.text}
        </div>
      ))}
    </div>
  );
}

export default PublicTabs;
