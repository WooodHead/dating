import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import PopupNotification from "components/Popups/PopupNotification";
import Button from "components/Button"
import { useMemo } from "react";
import { auth } from "store/auth/auth";
import { userProfile } from "store/user/profile";
import { additionalData } from "store/additional/additionalData";
import Head from "next/head";
import ProfileAside from "components/IndexPage/ProfileAside";
import cn from "classnames";
import styles from "./index.module.scss";

function MainLayout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const isPremiumPopupActive = useSelector(userProfile.selectors.isPremiumPopupActive);
  const additionalEnums = useSelector(additionalData.selectors.enums);
  const additionalLang = useSelector(additionalData.selectors.lang);
  const additionalNational = useSelector(additionalData.selectors.nationals);
  const currentToken = useSelector(auth.selectors.currentToken);
  const profile = useSelector(userProfile.selectors.profile);
  
  const userIsLogged = useMemo(() => {
    return currentToken && Object.values(profile).length > 0;
  }, [currentToken, profile]);

  useEffect(() => {
    if (!Object.keys(additionalEnums).length) {
      dispatch(additionalData.thunks.getAdditionalEnums());
    }

    if (!Object.keys(additionalNational).length) {
      dispatch(additionalData.thunks.getAdditionalNational());
    }

    if (!Object.keys(additionalLang).length) {
      dispatch(additionalData.thunks.getAdditionalLang());
    }
  }, []);

  const handleClosePopup = () => {
    dispatch(userProfile.actions.TOGGLE_POPUP(false));
  };

  const handleBuySubscription = () => {
    router.push('/account/subscription');
    dispatch(userProfile.actions.TOGGLE_POPUP(false));
  };
  
  return (
    <>
      <Head>
        <title>Dating</title>
      </Head>
      <main className={styles.main}>
        <div className="container">
          <div className={styles.wrap}>
            {userIsLogged && <ProfileAside />}
            <div className={cn(
              styles.content,
              { [styles['content--is-logged']]: userIsLogged },
            )}>
              <div className={styles.container}>
                {children}
              </div>
            </div>
          </div>
        </div>

        {isPremiumPopupActive && (
            <PopupNotification onClose={handleClosePopup}>
              You&apos;re trying to access a premium account. Upgrade it
              now to enjoy Advanced Features on My Subscription.

              <div className="d-flex flex-column justify-content-between mt-2 mt-4">
                <div className="mb-2">
                  <Button
                      type="button"
                      onClick={handleBuySubscription}
                      fullWidth
                  >
                      Get it now
                  </Button>
                </div>
                <div>
                  <Button
                      type="button"
                      onClick={handleClosePopup}
                      fullWidth
                      outline
                      dark
                  >
                    No, Thanks
                  </Button>
                </div>
              </div>
            </PopupNotification>
        )}
      </main>
    </>
  );
}

export default MainLayout;
