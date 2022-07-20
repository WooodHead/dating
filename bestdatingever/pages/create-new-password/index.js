import AuthLayout from "layouts/Auth";
import TextField from "components/Form/TextField";
import Button from "components/Button";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { userEditProfile } from "store/user/edit-profile";
import {useEffect, useMemo} from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { defaultValues, schema } from "configs/auth/create-new-password";
import RegisterOverlay from "components/RegisterPage/RegisterOverlay";
import cn from 'classnames';
import styles from './index.module.scss'

CreateNewPasswordPage.layouts = [AuthLayout];
CreateNewPasswordPage.accessMode = 'public'
CreateNewPasswordPage.title = 'New password'

function CreateNewPasswordPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const token = router.query.token;
  const createNewPasswordStatus = useSelector(userEditProfile.selectors.createNewPasswordStatus);

  const isRequestSuccess = useMemo(() => createNewPasswordStatus === 'success', [createNewPasswordStatus]);

  const { control, handleSubmit } = useForm({
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
    <>
      <RegisterOverlay />
      
      <div className={styles.wrap}>
      <form
        className={cn(
          styles.form,
          'form-overlay mx-auto'
        )}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="title-xs text-medium text-center text-new-york color-white mb-4">
          Create new password
        </div>
        <div className="mb-2">
          <TextField
            id="password"
            label="New password"
            name="password"
            control={control}
            type="password"
            fullWidth
            dark
          />
          <TextField
            id="repeatPassword"
            label="Repeat password"
            name="repeatPassword"
            control={control}
            type="password"
            fullWidth
            dark
          />
        </div>
        <div className="d-flex justify-content-center">
          <Button
            loader={createNewPasswordStatus === 'pending'}
            type="submit"
            theme="gradient"
            size="lg"
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
    </>
  );
}

export default CreateNewPasswordPage;
