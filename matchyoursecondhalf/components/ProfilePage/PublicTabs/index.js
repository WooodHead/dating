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
    <div className="d-flex align-items-center mb-4 mb-md-2">
      {tabs.map(tab => (
        <div
          key={tab.text}
          className="d-flex mr-4 cursor-pointer"
          onClick={() => onClick(tab)}
        >
          {tab.src && (
            <img
              src={tab.src}
              alt=""
              className="icon-default mr-1"
            />
          )}
          <div
            className={cn(
              styles.text,
              'text-xl text-semibold color-grey-600',
              { [styles['text--active']]: tab.slug === tabActive },
              { 'color-blue-600': tab.slug === tabActive }
            )}
          >
            {tab.text}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PublicTabs;
