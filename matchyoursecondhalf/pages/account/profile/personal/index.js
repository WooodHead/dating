import MainLayout from 'layouts/Main';
import PersonalAboutMyself from "components/AccountPage/PersonalAboutMyself";
import PersonalGeneral from "components/AccountPage/PersonalGeneral";
import PersonalBody from "components/AccountPage/PersonalBody";
import PersonalNutrition from "components/AccountPage/PersonalNutrition";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { defaultValues, schema } from "configs/account/personal";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "store/user/profile";
import { userEditProfile } from "store/user/edit-profile";
import { additionalData } from "store/additional/additionalData";
import { format } from "date-fns";
import Loader from "components/Loader";
import styles from "./index.module.scss";

Personal.layouts = [MainLayout]

function Personal() {
  const dispatch = useDispatch();
  const user = useSelector(userProfile.selectors.profile);
  const additionalNational = useSelector(additionalData.selectors.nationals);

  const userLoaded = useMemo(() => {
    return !!Object.keys(user).length;
  }, [user]);

  const { control, handleSubmit, reset, getValues } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    reset({ ...defaultValues, ...user });
  }, [user]);

  const onSubmit = data => {
    const {
      user,
      online,
      dob,
      languages,
      location,
      nationality,
      ...userData
    } = data;
    
    const lang = languages.map(lang => lang._id);
    const national = additionalNational.find(national => national.name === nationality);

    const formData = {
      ...userData,
      languages: lang,
      location: location?._id,
      nationality: national?._id,
      dob: format(dob, "dd-MM-yyyy")
    };

    dispatch(userEditProfile.thunks.userEditProfile(formData));
  };

  return (
    userLoaded ? (
      <form
        className={styles.wrap}
        onSubmit={handleSubmit(onSubmit)}
      >
        <PersonalAboutMyself control={control} getValues={getValues}/>
        <PersonalGeneral control={control}/>
        <PersonalBody control={control}/>
        <PersonalNutrition control={control}/>
      </form>
    ) : (
      <Loader/>
    )
  );
}

export default Personal;
