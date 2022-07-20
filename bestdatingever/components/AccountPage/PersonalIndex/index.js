import PersonalAboutMyself from "components/AccountPage/PersonalAboutMyself";
import PersonalGeneral from "components/AccountPage/PersonalGeneral";
import PersonalBody from "components/AccountPage/PersonalBody";
import PersonalLanguages from "components/AccountPage/PersonalLanguages";
import PersonalGeography from "components/AccountPage/PersonalGeography";
import PersonalStatus from "../PersonalStatus";
import Button from "components/Button";
import { format } from "date-fns";
import { userEditProfile } from "store/user/edit-profile";
import { additionalData } from "store/additional/additionalData";
import { useForm } from "react-hook-form";
import { defaultValues, schema } from "configs/account/personal";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.scss";

function PersonalIndex({ user }) {
  const dispatch = useDispatch();
  const additionalNational = useSelector(additionalData.selectors.formattedNationals);
  const editProfileStatus = useSelector(userEditProfile.selectors.editProfileStatus);
  
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <PersonalAboutMyself control={control} />
      <div className={styles.wrap}>
        <PersonalStatus control={control} getValues={getValues} />
        <div className={styles.content}>
          <PersonalGeneral control={control} />
          <PersonalBody control={control} />
          <PersonalLanguages control={control} />
          <PersonalGeography control={control} />
        </div>
      </div>
      <div className={styles.button}>
        <Button
          type="submit"
          loader={editProfileStatus === 'pending'}
        >
          Submit
        </Button>
      </div>
    </form>
  );
}

export default PersonalIndex;
