import MainLayout from "layouts/Main";
import TextField from "components/Form/TextField";
import Button from "components/Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { defaultValues, schema } from "configs/account/change-password";
import { useDispatch, useSelector } from "react-redux";
import { userEditProfile } from "store/user/edit-profile";
import { useEffect, useState } from "react";
import PopupNotification from "components/Popups/PopupNotification";
import styles from "./index.module.scss";

ChangePassword.layouts = [MainLayout];

function ChangePassword() {
  const dispatch = useDispatch();
  const changePasswordStatus = useSelector(userEditProfile.selectors.changePasswordStatus);
  const [popupNotification, setPopupNotification] = useState(false);
  
  const { control, handleSubmit, reset } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });
  
  const onSubmit = async (data) => {
    const formData = {
      old_password: data.currentPassword,
      password: data.newPassword,
      r_password: data.repeatPassword
    };
    
    await dispatch(userEditProfile.thunks.changePassword(formData));
  };
  
  useEffect(() => {
    if (changePasswordStatus === 'success') {
      setPopupNotification(true);
      reset();
      dispatch(userEditProfile.actions.RESET_STATUS('changePasswordStatus'));
    }
  }, [changePasswordStatus]);
  
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          id="currentPassword"
          label="Current password"
          placeholder="Current password"
          name="currentPassword"
          control={control}
          type="password"
        />
        <TextField
          id="newPassword"
          label="New password"
          placeholder="New password"
          name="newPassword"
          control={control}
          type="password"
        />
        <TextField
          id="repeatPassword"
          label="Repeat new password"
          placeholder="Repeat new password"
          name="repeatPassword"
          control={control}
          type="password"
        />
        <div className={styles.button}>
          <Button
            type="submit"
            dark
            textSize="md"
            loader={changePasswordStatus === 'pending'}
          >
            Submit
          </Button>
        </div>
      </form>
      {popupNotification && (
        <PopupNotification
          onClose={() => setPopupNotification(false)}
        >
          Your password has been successfully changed
        </PopupNotification>
      )}
    </>
  );
}

export default ChangePassword;
