import Masonry from "react-masonry-css";
import styles from "./index.module.scss";

function MasonryComponent({ children }) {
  const breakpointColumnsObj = {
    default: 3,
    768: 2,
    576: 1,
  };
  
  return (
    <div className="position-relative pt-4 mb-4">
      <div className={styles.bg} />
      
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className={styles.list}
        columnClassName={styles.col}
      >
        {children}
      </Masonry>
    </div>
  );
}

export default MasonryComponent;
