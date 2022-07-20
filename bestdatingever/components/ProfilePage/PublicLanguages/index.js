import PublicBox from "components/ProfilePage/PublicBox";
import PublicBoxTitle from "components/ProfilePage/PublicBoxTitle";
import { useSelector } from "react-redux";
import { publicProfile } from "store/profile/public-profile";
import styles from "./index.module.scss";
import cn from "classnames";

function PublicLanguages() {
  const { languages } = useSelector(publicProfile.selectors.profile);
  
  return (
    <PublicBox>
      <PublicBoxTitle>Languages</PublicBoxTitle>
      <div className={styles.wrap}>
        {languages.length > 0 ? languages.map(lang => (
          <div
            key={lang._id}
            className={cn(styles.language, 'text-xl text-italic color-cyan-500')}
          >
            {lang.name}
          </div>
        )) : '-'}
      </div>
    </PublicBox>
  );
}

export default PublicLanguages;
