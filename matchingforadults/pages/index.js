import MainLayout from "layouts/Main";
import GlobalListingSearch from "components/IndexPage/GlobalListingSearch";
import GlobalListingPeople from "components/IndexPage/GlobalListingPeople";
import { useSelector } from "react-redux";
import { userProfile } from "store/user/profile";
import { useEffect, useState } from "react";
import { auth } from "store/auth/auth";
import Button from "components/Button";
import IconFilterSearch from "components/icons/IconFilterSearch";
// import styles from "./index.module.scss";

Index.layouts = [MainLayout];
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
    <>
      {!filterIsVisible && (
        <h2 className="d-flex align-items-center justify-content-between title-md text-normal text-palatino mb-4">
          Find People Nearby
          <Button
            size="sm"
            className="text-open-sans text-semibold"
            onClick={() => setFilterIsVisible(!filterIsVisible)}
          >
            Filters
            <IconFilterSearch className="ml-1" />
          </Button>
        </h2>
      )}

      {isShowed && (
        <>
          <GlobalListingSearch
            filterIsVisible={filterIsVisible}
            onCloseFilter={() => setFilterIsVisible(false)}
          />
          <GlobalListingPeople />
        </>
      )}
    </>
  )
}

export default Index;
