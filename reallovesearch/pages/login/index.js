import AuthLayout from "layouts/Auth";
import TextField from "components/Form/TextField";
import Button from "components/Button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { defaultValues, schema } from "configs/auth/login";
import Router from "next/router";
import { useDispatch } from "react-redux";
import {auth} from "store/auth/auth";
import cn from "classnames";
import styles from "./index.module.scss";
import PopupNotification from "components/Popups/PopupNotification";
import { useState } from "react";

LoginPage.layouts = [AuthLayout]
LoginPage.accessMode = 'public'

function LoginPage() {
  const [popupNotification, setPopupNotification] = useState(false);

  const { control, getValues, handleSubmit } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    const {email, ...registerData} = data;
    const formData = {
      ...registerData,
      email: email.toLowerCase(),
    };

    const {payload} = await dispatch(auth.thunks.login(formData));
    if (payload?.statusCode === 403) setPopupNotification(true);
    else if (payload?.statusCode === 418) Router.push({
      pathname: '/account-verified',
      query: {email: getValues('email')}
    });
  }

  return (
    <>
      <div className="container">
        <div className={styles.wrap}>
          <form
            className={cn(
              styles.form,
              'form-overlay'
            )}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="title-xs text-medium text-poppins color-blue-900 mb-5">
              Log in
            </div>
            <TextField
              id="email"
              label="Email"
              name="email"
              control={control}
              fullWidth
            />
            <TextField
              id="password"
              label="Password"
              name="password"
              control={control}
              type="password"
              fullWidth
            />
            <Link href="/reset-password">
              <a className={cn(
                styles.forgot,
                'text-md text-semibold color-blue-900 mb-5 cursor-pointer'
              )}>
                Forgot your password?
              </a>
            </Link>
            <div className="d-flex justify-content-between mb-4">
              <Button
                text="Log in"
                type="submit"
                fullWidth
              />
            </div>
            <div className="d-flex justify-content-between title-xs">
              Don't have an account?
              <Link href="/register">
                <a className="text-semibold color-pink-300">
                  Sign up
                </a>
              </Link>
            </div>
          </form>
          <div className={styles.img}>
            <img src="/img/auth/auth-bg.svg" alt=""/>
          </div>
        </div>
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
