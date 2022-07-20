import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { defaultValues, schema } from "configs/account/change-phone";
import { userEditProfile } from "store/user/edit-profile";
import { userProfile } from "store/user/profile";
import MainLayout from "layouts/Main";
import AccountProfileLayout from "layouts/AccountSettings";
import TextField from "components/Form/TextField";
import Button from "components/Button";
import styles from "../change-email/index.module.scss";

ChangePhonePage.layouts = [MainLayout, AccountProfileLayout];

function ChangePhonePage() {
  const dispatch = useDispatch();
  const changePhoneStatus = useSelector(userEditProfile.selectors.changePhoneStatus);
  const { phone } = useSelector(userProfile.selectors.profile);

  const {
    control,
    handleSubmit,
    reset
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    await dispatch(userEditProfile.thunks.changePhone(data));
    await dispatch(userProfile.thunks.getUserProfile());
  };

  useEffect(() => {
    if (changePhoneStatus === 'success') {
      reset();
      dispatch(userEditProfile.actions.RESET_STATUS('changePhoneStatus'));
    }
  }, [changePhoneStatus]);

  return (
    <>
      <div className="d-flex align-items-end mb-3">
        <div className="text-md text-bold mr-4">Phone:</div>
        <div>{phone || `No phone added`}</div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          id="phone"
          label="New phone"
          name="phone"
          type="text"
          control={control}
        />
        <div className={styles.button}>
          <Button
            text="Submit"
            type="submit"
            dark
            loader={changePhoneStatus === 'pending'}
          />
        </div>
      </form>
    </>
  );
}

export default ChangePhonePage;