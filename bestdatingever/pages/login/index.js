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
import RegisterOverlay from "components/RegisterPage/RegisterOverlay";
import Router from "next/router";
import cn from "classnames";
import styles from "./index.module.scss";

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
  const loginStatus = useSelector(auth.selectors.loginStatus);
  
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
  
  return (
    <>
      <RegisterOverlay/>
      
      <div className={styles.wrap}>
        <form
          className={cn(
            styles.form,
            'form-overlay mx-auto'
          )}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="title-xs text-medium text-center text-new-york color-white mb-4">
            Log in
          </div>
          <TextField
            id="email"
            label="Email"
            name="email"
            control={control}
            fullWidth
            dark
          />
          <TextField
            id="password"
            label="Password"
            name="password"
            control={control}
            type="password"
            fullWidth
            dark
          />
          <Link href="/reset-password">
            <a className={cn(
              styles.forgot,
              'text-md color-white mb-4 cursor-pointer'
            )}>
              Forgot your password?
            </a>
          </Link>
          <div className="d-flex justify-content-center mb-4">
            <Button
              type="submit"
              theme="gradient"
              size="sm"
              className="mr-1"
              loader={loginStatus === 'pending'}
            >
              Log in
            </Button>
            <Button
              size="sm"
              outline
              className="ml-1"
              onClick={() => Router.push('/register')}
            >
              Cancel
            </Button>
          </div>
          <div className="d-flex justify-content-between">
            <span className="text-md color-white">
              Don't have an account?
            </span>
            <Link href="/register">
              <a className="color-orange-500">
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
    </>
  );
}

export default LoginPage;
