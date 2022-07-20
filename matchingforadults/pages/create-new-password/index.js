import AuthLayout from "layouts/Auth";
import TextField from "components/Form/TextField";
import Button from "components/Button";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { userEditProfile } from "store/user/edit-profile";
import { useEffect, useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { defaultValues, schema } from "configs/auth/create-new-password";
import { mediaSizes } from "utils/constants";
import AuthHead from "components/AuthPage/AuthHead";
import { useDispatch, useSelector } from "react-redux";
import { windowActions } from "store/windowActions";
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

  const windowSize = useSelector(windowActions.selectors.windowSize);
  
  return (
    <div className="container">
      <div className={styles.wrap}>
        {windowSize.width >= mediaSizes.sm && (
          <AuthHead />
        )}
        
        <form
          className={cn(
            styles.form,
            'form-overlay mx-auto color-white'
          )}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="title-xs mb-3">
            Create new password
          </div>
          <div className="mb-2">
            <TextField
              placeholder="New password"
              name="password"
              control={control}
              type="password"
              fullWidth
              dark
            />
            <TextField
              placeholder="Repeat password"
              name="repeatPassword"
              control={control}
              type="password"
              fullWidth
              dark
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="mx-auto text-bold"
            pink
          >
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreateNewPasswordPage;
