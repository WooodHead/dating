import AccountProfileLayout from "layouts/AccountSettings";
import TextField from "components/Form/TextField";
import Button from "components/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { defaultValues, schema } from "configs/account/change-email";
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "layouts/Main";
import { userEditProfile } from "store/user/edit-profile";
import { userProfile } from "store/user/profile";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";

ChangeEmailPage.layouts = [MainLayout, AccountProfileLayout]

function ChangeEmailPage() {
  const dispatch = useDispatch();
  const changeEmailStatus = useSelector(userEditProfile.selectors.changeEmailStatus);
  const profile = useSelector(userProfile.selectors.profile);

  const { control, handleSubmit, reset } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });
  
  const onSubmit = async (data) => {
    await dispatch(userEditProfile.thunks.changeEmail(data));
  };
  
  useEffect(() => {
    if (changeEmailStatus === 'success') {
      reset();
      dispatch(userEditProfile.actions.RESET_STATUS('changeEmailStatus'));
    }
  }, [changeEmailStatus]);
  
  return (
    <>
      <div className="d-flex align-items-end mb-3">
        <div className="text-md text-semibold mr-4">Email:</div>
        <div className="color-grey-600">{profile.email}</div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          id="email"
          label="New email"
          name="email"
          control={control}
        />
        <div className={styles.button}>
          <Button
            text="Submit"
            type="submit"
            dark
            textSize="xl"
            loader={changeEmailStatus === 'pending'}
          />
        </div>
      </form>
    </>
  );
}

export default ChangeEmailPage;
