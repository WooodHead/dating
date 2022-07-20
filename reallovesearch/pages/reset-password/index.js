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
import cn from "classnames";
import styles from './index.module.scss';
import Router from "next/router";

ResetPasswordPage.layouts = [AuthLayout];
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
    <div className="container">
      <div className={styles.wrap}>
        {!isRequestSuccess && (
          <form
            className={cn(
              styles.form,
              'form-overlay color-blue-900'
            )}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="title-xs text-medium text-poppins mb-2">
              Reset password
            </div>
            <div className="text-md mb-3">
              Please enter your email to reset your password
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
                textSize="lg"
                fullWidth
              />
            </div>
          </form>
        )}
        {isRequestSuccess && (
          <div className={cn(
            'form-overlay text-center',
            styles['reset-password']
          )}>
            <div className="title-xs text-medium text-poppins mb-4">Reset password</div>
            <div className="form-overlay__btn-close">
              <IconButton onClick={onHandleCloseModal}>
                <IconClose color="#031539"/>
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
                    text="Resend"
                    type="submit"
                    textSize="lg"
                />
              </div>
            </form>
          </div>
        )}
        <div className={styles.img}>
          <img src="/img/auth/auth-bg.svg" alt=""/>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
