import Head from "next/head";
import AppHeader from 'components/App/AppHeader';
import AppFooter from "components/App/AppFooter";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "store/user/profile";
import { auth } from "store/auth/auth";
import { windowActions } from "store/windowActions";

function AppLayout({children, isBlank}) {
  const isServer = () => typeof window === 'undefined';
  const dispatch = useDispatch();
  const userProfileInfo = useSelector(userProfile.selectors.profile);
  const userIsLogged = useSelector(auth.selectors.currentToken);

  useEffect(() => {
    if (userIsLogged && !Object.keys(userProfileInfo).length) {
      dispatch(userProfile.thunks.getUserProfile());
    }
  }, []);
  
  useEffect(() => {
    const setWindowResize = () => {
      dispatch(windowActions.actions.SET_WINDOW_RESIZE({
        width: window.innerWidth,
        height: window.innerHeight,
      }))
    };
    
    if (!isServer()) {
      window.addEventListener('resize', setWindowResize);
      setWindowResize();
    }
    
    return () => window.removeEventListener('resize', setWindowResize);
  }, []);

  return (
    <>
      <Head>
        <title>bestdatingever</title>
      </Head>
      {!isBlank && <AppHeader/>}
      {children}
      {!isBlank && <AppFooter/>}
    </>
  );
}

export default AppLayout;
