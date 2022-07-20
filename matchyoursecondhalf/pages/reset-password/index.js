import {
  useState,
  useEffect,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { userEditProfile } from "store/user/edit-profile";
import AuthLayoutResetPassword from "layouts/Auth/ResetPassword";
import TextField from "components/Form/TextField";
import Button from "components/Button";
import IconButton from "components/IconButton";
import IconClose from "/components/icons/IconClose";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { defaultValues, schema } from "configs/auth/reset-password";
import Router from "next/router";
import cn from "classnames";
import styles from './index.module.scss'

ResetPasswordPage.layouts = [AuthLayoutResetPassword];
ResetPasswordPage.accessMode = 'public';

function ResetPasswordPage() {
  const dispatch = useDispatch();
  const resetPasswordStatus = useSelector(userEditProfile.selectors.resetPasswordStatus);
  const resendResetPasswordStatus = useSelector(userEditProfile.selectors.onResendStatus);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });

  const [currentEmail, setCurrentEmail] = useState(null);

  const isRequestSuccess = useMemo(() => resetPasswordStatus === 'success', [resetPasswordStatus]);

  const onSubmit = async (data) => {
    await dispatch(userEditProfile.thunks.resetPassword(data));
    const preparedEmail = `${data.email.slice(0, 4)}******${data.email.slice(data.email.lastIndexOf('@'))}`;
    setCurrentEmail(preparedEmail);
  };

  const onResendSubmit = async (data) => {
    await dispatch(userEditProfile.thunks.resendResetPassword(data));
  } ;

  const onHandleCloseModal = () => {
    Router.push('/login');
    dispatch(userEditProfile.actions.RESET_STATUS('resetPasswordStatus'));
    dispatch(userEditProfile.actions.RESET_STATUS('onResendStatus'));
  };

  useEffect(() => {
    const handleRouteChange = (url) => {
      dispatch(userEditProfile.actions.RESET_STATUS('resetPasswordStatus'));
      dispatch(userEditProfile.actions.RESET_STATUS('onResendStatus'));
    }

    Router.events.on('routeChangeStart', handleRouteChange);
    return () => Router.events.off('routeChangeStart', handleRouteChange);
  }, []);
  
  return (
    <div className="container p-sm-0">
      {!isRequestSuccess && (
        <form
          className={cn(
            styles.form,
            'form-overlay mx-auto'
          )}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="title-xs text-medium text-bitter mb-4">
            Reset password
          </div>
          <div className="mb-2">
            <TextField
              id="email"
              label="Email"
              name="email"
              control={control}
              fullWidth
            />
          </div>
          <div className="d-flex justify-content-between">
            <Button
              loader={resetPasswordStatus === 'pending'}
              text="Send"
              type="submit"
              fullWidth
              dark
            />
          </div>
        </form>
      )}
      {isRequestSuccess && (
        <div className={cn(
          styles.form,
          'form-overlay mx-auto'
        )}>
          <div className="form-overlay__btn-close">
            <IconButton onClick={onHandleCloseModal}>
              <IconClose color="#355C7D"/>
            </IconButton>
          </div>
          <div className="text-lg">
            {`We sent a password reset link to ${currentEmail}. Click the link within 1 week or you'll need to request a new one.
            If you don't see the email, check your spam folder.`}
          </div>
          <form onSubmit={handleSubmit(onResendSubmit)}>
            <div className="d-flex justify-content-center mt-2">
              <Button
                  loader={resendResetPasswordStatus === 'pending'}
                  text="Resend"
                  type="submit"
                  textSize="lg"
                  dark
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ResetPasswordPage;
