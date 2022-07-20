import MainLayout from "layouts/Main";
import GlobalListingSearch from "components/IndexPage/GlobalListingSearch";
import GlobalListingPeople from "components/IndexPage/GlobalListingPeople";
import { useSelector } from "react-redux";
import { userProfile } from "store/user/profile";
import { useEffect, useState } from "react";
import { auth } from "store/auth/auth";

Index.layouts = [MainLayout];
Index.accessMode = 'all';

function Index() {
  const currentToken = useSelector(auth.selectors.currentToken);
  const profile = useSelector(userProfile.selectors.profile);
  
  const [isLogged, setIsLogged] = useState(false);
  const [isShowed, setIsShowed] = useState(false);
  
  const showComp = () => {
    setIsShowed(true);
  };
  
  useEffect(() => {
    if (currentToken) setIsLogged(true);
    else showComp();
  }, []);
  
  useEffect(() => {
    if (isLogged && Object.values(profile).length > 0) showComp();
  }, [isLogged, profile]);
  
  return (
    <>
      <h2 className="title-md text-semibold text-gilroy text-center color-blue-800 mb-2">
        Find People Nearby
      </h2>
      {isShowed && (
        <>
          <GlobalListingSearch/>
          <GlobalListingPeople/>
        </>
      )}
    </>
  )
}

Index.getInitialProps = ({ query }) => {
  return { query };
}

export default Index;
