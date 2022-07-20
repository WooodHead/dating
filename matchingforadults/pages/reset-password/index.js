import {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { userEditProfile } from "store/user/edit-profile";
import AuthLayout from "layouts/Auth";
import TextField from "components/Form/TextField";
import Button from "components/Button";
import IconButton from "components/IconButton";
import IconClose from "/components/icons/IconClose";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { defaultValues, schema } from "configs/auth/reset-password";
import Router from "next/router";
import AuthHead from "components/AuthPage/AuthHead";
import { mediaSizes } from "utils/constants";
import { windowActions } from "store/windowActions";
import cn from 'classnames'
import styles from './index.module.scss'

ResetPasswordPage.layouts = [AuthLayout];
ResetPasswordPage.accessMode = 'public';
ResetPasswordPage.title = 'Reset password';

function ResetPasswordPage() {
  const dispatch = useDispatch();
  const resetPasswordStatus = useSelector(userEditProfile.selectors.resetPasswordStatus);
  const resendResetPasswordStatus = useSelector(userEditProfile.selectors.onResendStatus);

  const { control, handleSubmit } = useForm({
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
  
  const windowSize = useSelector(windowActions.selectors.windowSize);

  useEffect(() => {
    const handleRouteChange = (url) => {
      dispatch(userEditProfile.actions.RESET_STATUS('resetPasswordStatus'));
      dispatch(userEditProfile.actions.RESET_STATUS('onResendStatus'));
    }

    Router.events.on('routeChangeStart', handleRouteChange);
    return () => Router.events.off('routeChangeStart', handleRouteChange);
  }, []);
  
  return (
    <div className="container">
      <div className={styles.wrap}>
        {windowSize.width >= mediaSizes.sm && (
          <AuthHead />
        )}
        
        {!isRequestSuccess && (
          <form
            className={cn(
              styles.form,
              'form-overlay mx-auto color-white'
            )}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="title-xs mb-3">
              Reset password
            </div>
            <div className="mb-2">
              <TextField
                placeholder="Email"
                name="email"
                control={control}
                fullWidth
                dark
              />
            </div>
            <div className="d-flex justify-content-between">
              <Button
                loader={resetPasswordStatus === 'pending'}
                type="submit"
                size="lg"
                className="mx-auto text-bold"
                pink
              >
                Send
              </Button>
            </div>
          </form>
        )}
        
        {isRequestSuccess && (
          <div className={cn(
            styles.form,
            'form-overlay mx-auto color-white'
          )}>
            <div className="d-flex justify-content-end">
              <IconButton onClick={onHandleCloseModal} >
                <IconClose color="#F6E7EC"/>
              </IconButton>
            </div>
            <div className="text-lg">
              {`We sent a password reset link to ${currentEmail}. Click the link within 1 week or you'll need to request a new one.
                If you don't see the email, check your spam folder.`}
            </div>
            <form onSubmit={handleSubmit(onResendSubmit)}>
              <div className="d-flex justify-content-center mt-1">
                <Button
                    loader={resendResetPasswordStatus === 'pending'}
                    type="submit"
                    textSize="lg"
                >
                    Resend
                </Button>
              </div>
            </form>

          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
