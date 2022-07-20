import HomeLayout from "layouts/Home";
import GlobalListingSearch from "components/IndexPage/GlobalListingSearch";
import GlobalListingPeople from "components/IndexPage/GlobalListingPeople";
import { useSelector } from "react-redux";
import { userProfile } from "store/user/profile";
import { useEffect, useState } from "react";
import { auth } from "store/auth/auth";

Index.layouts = [HomeLayout];
Index.accessMode = 'all';

function Index() {
  const currentToken = useSelector(auth.selectors.currentToken);
  const profile = useSelector(userProfile.selectors.profile);
  
  const [isLogged, setIsLogged] = useState(false);
  const [isShowed, setIsShowed] = useState(false);
  const [filterIsVisible, setFilterIsVisible] = useState(false);
  
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
    isShowed && (
      <>
        <GlobalListingSearch filterIsVisible={filterIsVisible} setFilterIsVisible={setFilterIsVisible} />
        <GlobalListingPeople filterIsVisible={filterIsVisible}/>
      </>
    )
  )
}

export default Index;
