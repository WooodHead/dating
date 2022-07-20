import Logo from "components/Logo";
import Link from "next/link";
import { useSelector } from "react-redux";
import { auth } from "store/auth/auth";
import { userProfile } from "store/user/profile";
import SettingsForLogged from "./SettingsForLogged";
import SettingsForAll from "./SettingsForAll";
import { useMemo } from "react";
import cn from "classnames";
import styles from './index.module.scss';

function AppHeader() {
  const currentToken = useSelector(auth.selectors.currentToken);
  const profile = useSelector(userProfile.selectors.profile);
  
  const userIsLogged = useMemo(() => {
    return currentToken && Object.values(profile).length > 0;
  }, [currentToken, profile])
  
  return (
    <header className={cn(
      styles.header,
      { [styles['header--is-logged']]: userIsLogged }
    )}>
      <div className="container">
        <div className={styles.wrap}>
          <Link href="/">
            <a>
              <Logo isLogged={userIsLogged} />
            </a>
          </Link>
          {userIsLogged ? (
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
