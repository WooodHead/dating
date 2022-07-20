import IconFilterSearch from "components/icons/IconFilterSearch";
import cn from "classnames";
import styles from "./index.module.scss";

function GlobalListingTitle({ filterIsVisible, setFilterIsVisible }) {


  return (
    <div className="d-flex justify-content-between align-items-center">
      <h2 className="title-md text-medium text-bitter color-blue-900 mb-2">
        Find People Nearby
      </h2>
      <div
        className={cn(
          'd-inline-flex align-items-center cursor-pointer'
        )}
        onClick={() => setFilterIsVisible(!filterIsVisible)}
      >
        <div className={cn(
          { [styles['icon-filter-visible']]: filterIsVisible },
        )}>
          <IconFilterSearch color='#49483E' />
        </div>
      </div>
    </div>
  )
}

export default GlobalListingTitle