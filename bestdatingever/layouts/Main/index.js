import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import PopupNotification from "components/Popups/PopupNotification";
import { userProfile } from "store/user/profile";
import Button from "components/Button"
import { additionalData } from "store/additional/additionalData";
import Head from "next/head";
import cn from "classnames";
import styles from "./index.module.scss";

function MainLayout({ children, disableYOffset }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const isPremiumPopupActive = useSelector(userProfile.selectors.isPremiumPopupActive);
  const additionalEnums = useSelector(additionalData.selectors.enums);
  const additionalLang = useSelector(additionalData.selectors.lang);
  const additionalNational = useSelector(additionalData.selectors.nationals);

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
        <title>bestdatingever</title>
      </Head>
      <main className={cn(
        styles.main,
        {'pt-5': !disableYOffset}
      )}>
        <div className="container">
          {children}
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
                      pink
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
