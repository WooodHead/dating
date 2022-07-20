import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usersProfiles } from "store/users/profiles";
import { auth } from "store/auth/auth";
import { userProfile } from "store/user/profile";
import PersonCard from "components/Cards/PersonCard";
import PremiumPlug from "../PremiumPlug/index";
import ListEmpty from "components/ListEmpty";
import Loader from "components/Loader";
import cn from "classnames";
import styles from "./index.module.scss";

function GlobalListingPeople() {
  const dispatch = useDispatch();
  const list = useSelector(usersProfiles.selectors.profiles);
  const requestStatus = useSelector(usersProfiles.selectors.status);
  const requestStatusMore = useSelector(usersProfiles.selectors.statusMore);
  const listBox = useRef();
  const [loadMore, setLoadMore] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const currentToken = useSelector(auth.selectors.currentToken);
  const profile = useSelector(userProfile.selectors.profile);
  
  const userIsLogged = useMemo(() => {
    return currentToken && Object.values(profile).length > 0;
  }, [currentToken, profile]);

  useEffect(() => {
    const getList = async () => {
      await dispatch(usersProfiles.thunks.getUsersProfiles());
      setLoadMore(true);
    };
    
    getList();

    return () => dispatch(usersProfiles.actions.RESET_STATE());
  }, []);

  useEffect(() => {
    const onScroll = async (e) => {
      if (!userIsLogged) return;

      if (!profile.isPremiumUser) return;
      
      setScrollTop(e.target.documentElement.scrollTop);
      setScrolling((listBox.current?.getBoundingClientRect().bottom - window.innerHeight) <= 0);

      if (scrolling && loadMore && requestStatusMore === 'success') {
        setLoadMore(false);
        await dispatch(usersProfiles.thunks.loadMore());
        setTimeout(() => setLoadMore(true), 1000);
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollTop, loadMore]);

  return (
    <>
      <div
        className={cn(
          styles.list,
          'test',
          'mb-5'
        )}
        ref={listBox}
      >
        {requestStatus === 'pending' && <Loader/>}
        {requestStatus === 'success' && (
          !!list.length ? list.map(person => (
            <PersonCard
              key={person._id}
              {...person}
            />
          )) : <ListEmpty text="No results"/>
        )}
      </div>
      {!profile.isPremiumUser && userIsLogged && ( <PremiumPlug /> )}
      <div className="mb-5">
        {requestStatusMore === 'pending' && <Loader size="md"/>}
      </div>
    </>
  );
}

export default GlobalListingPeople;
