import Logo from "components/Logo";
import Link from "next/link";
import { useSelector } from "react-redux";
import { auth } from "store/auth/auth";
import { userProfile } from "store/user/profile";
import SettingsForLogged from "./SettingsForLogged";
import SettingsForAll from "./SettingsForAll";
import styles from './index.module.scss';

function AppHeader() {
  const currentToken = useSelector(auth.selectors.currentToken);
  const profile = useSelector(userProfile.selectors.profile);
  
  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.wrap}>
          <Link href="/">
            <a>
              <Logo/>
            </a>
          </Link>
          {currentToken && Object.values(profile).length > 0 ? (
            <SettingsForLogged profile={profile}/>
          ) : (
            <SettingsForAll/>
          )}
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
