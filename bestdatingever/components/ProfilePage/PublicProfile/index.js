import PublicActions from "components/ProfilePage/PublicActions";
import PublicSimilarProfiles from "components/ProfilePage/PublicSimilarProfiles";
import PublicDescription from "components/ProfilePage/PublicDescription";
import PublicInformation from "components/ProfilePage/PublicInformation";
import PublicLanguages from "components/ProfilePage/PublicLanguages";
import { useSelector } from "react-redux";
import { windowActions } from "store/windowActions";
import { mediaSizes } from "utils/constants";
import styles from "./index.module.scss";

function PublicProfile() {
  const windowSize = useSelector(windowActions.selectors.windowSize);
  
  return (
    <>
      {windowSize.width > mediaSizes.md && <PublicDescription />}
      
      <div className={styles.profile}>
        
        <div className={styles.aside}>
          <PublicActions />
          {windowSize.width <= mediaSizes.md && <PublicDescription />}
          {windowSize.width > mediaSizes.md && <PublicSimilarProfiles />}
        </div>
        
        <div className={styles.content}>
          <PublicInformation />
          <PublicLanguages />
          {windowSize.width <= mediaSizes.md && (
            <div className="mt-4">
              <PublicSimilarProfiles />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PublicProfile;
