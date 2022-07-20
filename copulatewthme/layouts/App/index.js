import Head from "next/head";
import AppHeader from 'components/App/AppHeader';
import AppFooter from "components/App/AppFooter";
import { useRouter } from 'next/router';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "store/user/profile";
import { auth } from "store/auth/auth";
import { windowActions } from "store/windowActions";
import { authService } from 'services/auth';

function AppLayout({ children, isBlank }) {
  const isServer = () => typeof window === 'undefined';
  const dispatch = useDispatch();
  const router = useRouter();
  const { token } = router.query;
  const userProfileInfo = useSelector(userProfile.selectors.profile);
  const userIsLogged = useSelector(auth.selectors.currentToken);

  const autoLoginUserInSystem = async () => {
    if (!userIsLogged && token) {
      authService.setCookies({ token });
      await dispatch(auth.actions.SET_TOKEN(token));
      await dispatch(userProfile.thunks.getUserProfile());
      window.history.replaceState(null, '', '/');
    }
  };

  useEffect(() => {
    autoLoginUserInSystem();

    if (userIsLogged && !Object.keys(userProfileInfo).length) {
      dispatch(userProfile.thunks.getUserProfile());
    }
  }, []);

  useEffect(() => {
    const setWindowResize = () => {
      dispatch(windowActions.actions.SET_WINDOW_RESIZE({
        width: window.innerWidth,
        height: window.innerHeight,
      }));
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
        <title>Dating</title>
      </Head>
      {!isBlank && <AppHeader />}
      {children}
      {!isBlank && <AppFooter />}
    </>
  );
}

export default AppLayout;
