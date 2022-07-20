import MainLayout from 'layouts/Main';
import PersonalAboutMyself from "components/AccountPage/PersonalAboutMyself";
import PersonalGeography from "components/AccountPage/PersonalGeography";
import PersonalBody from "components/AccountPage/PersonalBody";
import PersonalPhotos from "components/AccountPage/PersonalPhotos";
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
import Button from "components/Button";
// import styles from "./index.module.scss";

Personal.layouts = [MainLayout];

function Personal() {
  const dispatch = useDispatch();
  const user = useSelector(userProfile.selectors.profile);
  const additionalNational = useSelector(additionalData.selectors.nationals);
  const editProfileStatus = useSelector(userEditProfile.selectors.editProfileStatus)

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <PersonalAboutMyself control={control} getValues={getValues} />
        <PersonalBody control={control} />
        <PersonalPhotos />
        <PersonalGeography control={control} />
        <Button
          type="submit"
          loader={editProfileStatus === 'pending'}
          className="mb-6"
        >
          Submit
        </Button>
      </form>
    ) : (
      <Loader />
    )
  );
}

export default Personal;
