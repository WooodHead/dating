import AuthLayout from "layouts/Auth";
import TextField from "components/Form/TextField";
import Button from "components/Button";
import { useForm } from "react-hook-form";
import {useEffect, useMemo} from "react";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { userEditProfile } from "store/user/edit-profile";
import { yupResolver } from "@hookform/resolvers/yup";
import { defaultValues, schema } from "configs/auth/create-new-password";
import styles from "./index.module.scss";
import cn from "classnames";

CreateNewPasswordPage.layouts = [AuthLayout];
CreateNewPasswordPage.accessMode = 'public';

function CreateNewPasswordPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const token = router.query.token;
  const createNewPasswordStatus = useSelector(userEditProfile.selectors.createNewPasswordStatus);

  const isRequestSuccess = useMemo(() => createNewPasswordStatus === 'success', [createNewPasswordStatus]);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    const formData = {
      password: data.password,
      r_password: data.repeatPassword
    };
    await dispatch(userEditProfile.thunks.createNewPassword({formData, token}));
  };

  return (
    <div className="container">
      <div className={styles.wrap}>
        <form
          className={cn(
            styles.form,
            'form-overlay'
          )}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="title-xs text-medium text-poppins mb-2">
            Create new password
          </div>
          <div className="text-md mb-3">
            Please create a new password
          </div>
          <div className="mb-2">
            <TextField
              id="password"
              label="New password"
              name="password"
              control={control}
              type="password"
              fullWidth
            />
            <TextField
              id="repeatPassword"
              label="Repeat password"
              name="repeatPassword"
              control={control}
              type="password"
              fullWidth
            />
          </div>
          <div className="d-flex justify-content-between">
            <Button
              loader={createNewPasswordStatus === 'pending'}
              text="Continue"
              type="submit"
              textSize="lg"
              fullWidth
            />
          </div>
        </form>
        <div className={styles.img}>
          <img src="/img/auth/auth-bg.svg" alt=""/>
        </div>
      </div>
    </div>
  );
}

export default CreateNewPasswordPage;
