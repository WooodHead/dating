import AuthLayout from "layouts/Auth";
import TextField from "components/Form/TextField";
import Button from "components/Button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { defaultValues, schema } from "configs/auth/login";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "store/auth/auth";
import PopupNotification from "components/Popups/PopupNotification";
import { useState } from "react";
import AuthHead from "components/AuthPage/AuthHead";
import { windowActions } from "store/windowActions";
import { mediaSizes } from "utils/constants";
import cn from "classnames";
import styles from "./index.module.scss";
import Router from "next/router";

LoginPage.layouts = [AuthLayout]
LoginPage.accessMode = 'public'
LoginPage.title = 'Login';

function LoginPage() {
  const [popupNotification, setPopupNotification] = useState(false);
  
  const { control, getValues, handleSubmit } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });
  
  const dispatch = useDispatch();
  
  const onSubmit = async (data) => {
    const { email, ...registerData} = data;
    const formData = {
      ...registerData,
      email: email.toLowerCase(),
    };
    const { payload } = await dispatch(auth.thunks.login(formData));
    if (payload?.statusCode === 403) setPopupNotification(true);
    else if (payload?.statusCode === 418) Router.push({
      pathname: '/account-verified',
      query: {email: getValues('email')}
    });
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
            Log into your account
          </div>
          <TextField
            placeholder="Email"
            name="email"
            type="email"
            control={control}
            fullWidth
            dark
          />
          <TextField
            placeholder="Password"
            name="password"
            control={control}
            type="password"
            fullWidth
            dark
          />
          <Link href="/reset-password">
            <a className={cn(
              styles.forgot,
              'text-md text-medium text-underline-link cursor-pointer mb-4'
            )}>
              Forgot your password?
            </a>
          </Link>
          <div className="d-flex justify-content-between mb-2">
            <Button
              type="submit"
              size="lg"
              className="mx-auto text-bold"
              pink
            >
              Log in
            </Button>
          </div>
          <div className="d-flex justify-content-between">
            Don't have an account?
            <Link href="/register">
              <a className="text-bold">
                Sign up
              </a>
            </Link>
          </div>
        </form>
      </div>
      
      {popupNotification && (
        <PopupNotification onClose={() => setPopupNotification(false)}>
          Your account has been blocked by the administrator, you can use the service in 24 hours
        </PopupNotification>
      )}
    </div>
  );
}

export default LoginPage;
