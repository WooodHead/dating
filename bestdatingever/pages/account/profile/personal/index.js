import MainLayout from 'layouts/Main';
import AccountProfileLayout from "layouts/AccountProfile";
import PersonalIndex from "components/AccountPage/PersonalIndex";
import Loader from "components/Loader";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { userProfile } from "store/user/profile";
// import styles from "./index.module.scss";

Personal.layouts = [MainLayout, AccountProfileLayout];

function Personal() {
  const user = useSelector(userProfile.selectors.profile);

  const userLoaded = useMemo(() => {
    return !!Object.keys(user).length;
  }, [user]);
  
  return (
    userLoaded ? <PersonalIndex user={user} /> : <Loader />
  );
}

export default Personal;
