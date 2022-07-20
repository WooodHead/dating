import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { additionalData } from "store/additional/additionalData";
import { userProfile } from "store/user/profile";
import PopupConfirm from "components/Popups/PopupConfirm"
import Button from "components/Button";
import Head from "next/head";
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
            <PopupConfirm
                btnCancelIsVisible={true}
                btnConfirmText="Get it now"
                onConfirm={handleBuySubscription}
                onCancel={handleClosePopup}
                onClose={handleClosePopup}
            >
              <div className="text-center">
                You&apos;re trying to access a premium account. Upgrade it
                now to enjoy Advanced Features on My Subscription.
              </div>
            </PopupConfirm>
        )}
      </main>
    </>
  );
}

export default MainLayout;
