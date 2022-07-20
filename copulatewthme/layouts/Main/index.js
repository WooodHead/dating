import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { userProfile } from "store/user/profile";
import { additionalData } from "store/additional/additionalData";
import Head from "next/head";
import Button from "components/Button";
import PopupNotification from "components/Popups/PopupNotification";
import cn from "classnames";
import styles from "./index.module.scss";

function MainLayout({ children, disableYOffset }) {
  const router = useRouter();
  const dispatch = useDispatch();
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
        <title>Dating</title>
      </Head>
      <main className={cn(
        styles.main,
        { 'pt-3': !disableYOffset }
      )}>
        <div className="container">
          {children}
        </div>

        {isPremiumPopupActive && (
          <PopupNotification onClose={handleClosePopup}>
            You're trying to access a premium account. Upgrade it
            now to enjoy Advanced Features on My Subscription.

            <div className="d-flex flex-column justify-content-between mt-2 mt-4">
              <div className="mb-2">
                <Button
                  text="Get it now"
                  type="button"
                  onClick={handleBuySubscription}
                  fullWidth
                />
              </div>
              <div>
                <Button
                  text="No, Thanks"
                  type="button"
                  onClick={handleClosePopup}
                  fullWidth
                  transparent
                />
              </div>
            </div>
          </PopupNotification>
        )}

      </main>
    </>
  );
}

export default MainLayout;
